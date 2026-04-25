const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Student = require('../../models/Student');
const User = require('../../models/User');
const Class = require('../../models/Class');
const Counter = require('../../models/Counter');
const SystemLog = require('../../models/SystemLog');
const FeePayment = require('../../models/FeePayment');
const ExamMark = require('../../models/ExamMark');
const Attendance = require('../../models/Attendance');
const SchoolSetting = require('../../models/SchoolSetting');
const ExcelJS = require('exceljs');

// @desc    Register a new student
exports.registerStudent = async (req, res) => {
    try {
        const { fullIdentityName, academicEmail, classId, sectionId, rollRegistrationNumber } = req.body;
        const schoolId = req.user.schoolId;

        // 1. NATIVE JOI-EQUIVALENT VALIDATION
        if (!fullIdentityName || fullIdentityName.length < 2) return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
        if (fullIdentityName.length > 100) return res.status(400).json({ success: false, message: 'Name cannot exceed 100 characters' });
        if (!/^[a-zA-Z\s'-]+$/.test(fullIdentityName)) return res.status(400).json({ success: false, message: 'Name can only contain letters and spaces' });
        
        const sanitizedName = fullIdentityName.trim().replace(/\s+/g, ' ');

        if (!academicEmail || !academicEmail.endsWith('@school.edu')) {
            return res.status(400).json({ success: false, message: 'Email must be a valid @school.edu domain' });
        }
        
        if (rollRegistrationNumber) {
            if (rollRegistrationNumber.length > 20) return res.status(400).json({ success: false, message: 'Roll number cannot exceed 20 characters' });
            if (!/^[A-Z0-9-]+$/i.test(rollRegistrationNumber)) return res.status(400).json({ success: false, message: 'Invalid Roll Number pattern' });
        }

        // 2. DUPLICATE CHECK
        const exists = await User.findOne({ email: academicEmail });
        if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

        // CAPACITY CHECK
        const targetClass = await Class.findById(classId);
        if (!targetClass) return res.status(400).json({ success: false, message: 'Class not found' });
        
        const targetSection = targetClass.sections.id(sectionId);
        if (!targetSection) return res.status(400).json({ success: false, message: 'Section not found' });
        
        if (targetSection.totalStudents >= targetSection.capacity) {
            return res.status(422).json({ success: false, message: 'Class capacity reached' });
        }

        // AUTO-GEN ROLL NUMBER IF EMPTY
        let processedRoll = rollRegistrationNumber;
        if (!processedRoll) {
            const lastRoll = await Student.findOne({ sectionId }).sort({ createdAt: -1 }).select('studentId');
            const prefix = targetClass.name.replace('Class ', '').trim() + targetSection.name.trim(); // "10B"
            // Auto calculate sequence based on totalStudents enrollment rather than parsing strings for safety
            const seq = targetSection.totalStudents + 1; 
            processedRoll = prefix + String(seq).padStart(3, '0'); // e.g. "10B001"
        }

        // 3. AUTO-GEN STATUS ID
        const year = new Date().getFullYear();
        const counter = await Counter.findOneAndUpdate({ id: 'studentId' }, { $inc: { seq: 1 } }, { returnDocument: 'after', upsert: true });
        const studentId = `STU${year}${counter.seq.toString().padStart(4, '0')}`;

        // 4. AUTO-GENERATE CREDENTIALS
        const password = crypto.randomBytes(4).toString('hex');
        const systemId = 'SYS-' + crypto.randomUUID().slice(0, 8).toUpperCase();

        // 6. CREATE LOGIN USER (Done first for referential integrity)
        const user = await User.create({
            name: sanitizedName,
            email: academicEmail,
            password: password, // Mongoose pre-save hook handles bcrypt hash
            role: 'student',
            schoolId,
            isActive: true
        });

        // 5. CREATE STUDENT RECORD
        const student = await Student.create({
            user: user._id,
            studentId,
            classId,
            sectionId,
            name: sanitizedName,
            rollNumber: processedRoll,
            schoolId,
            status: 'active',
            admissionDate: new Date()
        });

        // 7. INCREMENT ENROLLMENT BUCKET
        targetSection.totalStudents += 1;
        await targetClass.save();

        // 8. AUDIT LOG
        await SystemLog.create({
            user: req.user._id,
            action: 'STUDENT_REGISTERED',
            details: `Registered ${studentId}`,
            ipAddress: req.ip
        });

        // 9 & 10. RESPONSE 201 (Email mock omitted/handled downstream)
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: {
                student: { 
                    _id: student._id, 
                    studentId, 
                    name: fullIdentityName, 
                    classId, 
                    sectionId 
                },
                credentials: {
                    systemId,
                    loginId: studentId,
                    password,          
                    academicEmail,
                    note: "Save these credentials. Password cannot be retrieved again."
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Bulk import students from Excel
exports.bulkImportStudents = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
        
        const results = { total: 0, imported: 0, failed: 0, errors: [], credentials: [] };
        const rows = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                // Flatten values because ExcelJS sometimes returns an object or a sparse array
                const vals = Array.isArray(row.values) ? row.values : Object.values(row.values);
                // Adjusting for 1-based indexing in row.values vs our extraction
                rows.push({ data: vals, line: rowNumber });
            }
        });

        for (const { data, line } of rows) {
            results.total++;
            try {
                // Extracting based on common Excel structure (A: Name, B: Email, C: Class, D: RollNo)
                // Note: ExcelJS row.values[1] is Column A
                const name = data[1]?.toString().trim();
                const email = data[2]?.toString()?.trim();
                const className = data[3]?.toString()?.trim();
                const section = data[4]?.toString()?.trim();
                const rollNumber = data[5]?.toString()?.trim();
                
                // If column 6 is a gender string (MALE/FEMALE), it's the template, so ignore custom credits
                const col6 = data[6]?.toString()?.trim();
                const isTemplate = col6 && ['MALE', 'FEMALE', 'OTHER'].includes(col6.toUpperCase());
                
                const customStudentId = isTemplate ? null : data[6]?.toString()?.trim();
                const customPassword = isTemplate ? null : data[7]?.toString()?.trim();

                if (!name || !email || !className) {
                    throw new Error(`Missing required fields at row ${line}`);
                }

                // Check for duplicate user in this session or DB
                let user = await User.findOne({ email });
                if (user) {
                    const studentProfile = await Student.findOne({ user: user._id });
                    if (studentProfile) {
                        throw new Error(`Email ${email} already registered`);
                    } else {
                        // This email was stuck in database from a previous crashed run.
                        // Delete the orphaned user account so we can create it freshly.
                        await User.deleteOne({ _id: user._id });
                        user = null;
                    }
                }

                let studentId = customStudentId;
                if (!studentId) {
                    const year = new Date().getFullYear();
                    const counter = await Counter.findOneAndUpdate({ id: 'studentId' }, { $inc: { seq: 1 } }, { returnDocument: 'after', upsert: true });
                    studentId = `STU${year}${counter.seq.toString().padStart(4, '0')}`;
                }

                const tempPassword = customPassword || Math.random().toString(36).slice(-8);

                user = await User.create({
                    name, email, password: tempPassword, role: 'student', schoolId: req.user.schoolId
                });

                const classObj = await Class.findOne({ name: className, schoolId: req.user.schoolId });

                await Student.create({
                    user: user._id, 
                    name, 
                    studentId, 
                    class: className, 
                    classId: classObj?._id,
                    section, 
                    rollNumber: rollNumber || 'N/A', 
                    schoolId: user.schoolId
                });

                results.credentials.push({ studentId, name, password: tempPassword });
                results.imported++;
            } catch (err) {
                results.failed++;
                results.errors.push({ line, reason: err.message });
            }
        }

        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get paginated student directory
exports.getStudentDirectory = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, classId, sectionId, status, sort = 'createdAt' } = req.query;
        const schoolId = req.user.schoolId;
        
        const queryParts = [
            { $or: [
                { schoolId: schoolId },
                { schoolId: { $exists: false } },
                { schoolId: "" }
            ]}
        ];
        
        if (classId) {
            if (mongoose.Types.ObjectId.isValid(classId)) {
                const classDoc = await Class.findById(classId);
                const classOrParts = [
                    { classId: classId },
                    { class: classId.toString() }
                ];
                if (classDoc) {
                    classOrParts.push({ class: classDoc.name });
                    // Also try case-insensitive name match
                    classOrParts.push({ class: { $regex: classDoc.name, $options: 'i' } });
                }
                queryParts.push({ $or: classOrParts });
            } else {
                queryParts.push({ class: { $regex: classId, $options: 'i' } });
            }
        }
        if (sectionId) {
            if (mongoose.Types.ObjectId.isValid(sectionId)) {
                const classWithSection = await Class.findOne({ "sections._id": sectionId });
                const sectionDoc = classWithSection?.sections.id(sectionId);
                const sectionOrParts = [
                    { sectionId: sectionId },
                    { section: sectionId.toString() }
                ];
                if (sectionDoc) {
                    sectionOrParts.push({ section: sectionDoc.name });
                    sectionOrParts.push({ section: { $regex: sectionDoc.name, $options: 'i' } });
                }
                queryParts.push({ $or: sectionOrParts });
            } else {
                queryParts.push({ section: { $regex: sectionId, $options: 'i' } });
            }
        }
        if (status) queryParts.push({ status: status });

        if (search) {
            const matchingUsers = await User.find({ 
                name: { $regex: search, $options: 'i' }, 
                schoolId 
            }).select('_id');
            const userIds = matchingUsers.map(u => u._id);

            queryParts.push({
                $or: [
                    { studentId: { $regex: search, $options: 'i' } },
                    { user: { $in: userIds } }
                ]
            });
        }

        const filter = { $and: queryParts };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        console.log('[StudentSvc] Filter:', JSON.stringify(filter, null, 2));
        
        const students = await Student.find(filter)
            .populate('user', 'name email avatar')
            .sort({ [sort]: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Student.countDocuments(filter);
        console.log(`[StudentSvc] Found ${students.length} students out of ${total} total.`);

        res.json({
            success: true,
            data: {
                students,
                pagination: { 
                    page: parseInt(page), 
                    limit: parseInt(limit), 
                    total, 
                    totalPages: Math.ceil(total / parseInt(limit)) 
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get student enrollment trend for charting
exports.getEnrollmentTrend = async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        const schoolId = req.user.schoolId;

        // Create date boundaries for the specified year
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const trendData = await Student.aggregate([
            {
                $match: {
                    schoolId,
                    admissionDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: '$admissionDate' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // Map aggregation results into a dictionary for fast lookup
        const found = {};
        trendData.forEach(item => {
            found[item._id.month] = item.count;
        });

        // Ensure all 12 months are represented even if no students enrolled
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const result = months.map((m, i) => ({
            month: m,
            enrolled: found[i + 1] || 0
        }));

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get student diversity and demographic data
exports.getStudentDiversity = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        const results = await Student.aggregate([
            { $match: { schoolId } }, 
            {
                $group: {
                    _id: { $toUpper: { $ifNull: ['$gender', 'OTHER'] } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = results.reduce((sum, r) => sum + r.count, 0);
        
        const breakdown = results.map(r => ({
            gender: r._id,
            count: r.count,
            percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
            color: r._id === 'MALE' ? '#5B4FCF' : r._id === 'FEMALE' ? '#E24B4A' : '#888780'
        }));

        res.json({
            success: true,
            data: {
                total,
                breakdown
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Real-time high-speed student network search (debounce optimized)
exports.probeStudentNetwork = async (req, res) => {
    try {
        const { q, classId, status } = req.query;
        const schoolId = req.user.schoolId;

        if (!q || q.length < 2) {
            return res.status(400).json({ success: false, message: 'Probe query must strictly exceed 1 character' });
        }

        const filter = { schoolId };
        if (classId) filter.class = classId;
        if (status) filter.status = status;

        // Extracting user identity matching dynamically
        const matchingUsers = await User.find({ 
            name: { $regex: q, $options: 'i' }, 
            schoolId 
        }).select('_id');
        const userIds = matchingUsers.map(u => u._id);

        filter.$or = [
            { studentId: { $regex: q, $options: 'i' } },
            { parentPhone: { $regex: q, $options: 'i' } },
            { user: { $in: userIds } }
        ];

        const students = await Student.find(filter)
            .populate('user', 'name email avatar')
            .limit(20);

        res.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    1. VIEW PROFILE (full student + metrics)
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user', 'name email avatar isActive');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const [totalDays, presentDays, feePayments, examMarks] = await Promise.all([
            Attendance.countDocuments({ schoolId: student.schoolId }),
            Attendance.countDocuments({ schoolId: student.schoolId, status: 'Present' }),
            FeePayment.find({ studentId: student.studentId }), 
            ExamMark.find({ student: student._id })
        ]);

        const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        const feeStatus = feePayments.length > 0 ? 'Clear' : 'Pending';

        res.json({
            success: true,
            data: {
                student,
                metrics: { attendancePercent, feeStatus, examResultsCount: examMarks.length }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    2a. GET STUDENT (pre-fill form)
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user', 'name email');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    2b. EDIT STUDENT 
exports.updateStudent = async (req, res) => {
    try {
        const { name, class: classId, section: sectionId, parentName, address, photo } = req.body;
        
        let student = await Student.findById(req.params.id).populate('user');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const changedFields = [];
        if (student.class !== classId) changedFields.push('class');
        if (student.section !== sectionId) changedFields.push('section');

        student.class = classId || student.class;
        student.section = sectionId || student.section;
        student.parentName = parentName || student.parentName;

        await student.save();

        if (name) {
            await User.findByIdAndUpdate(student.user._id, { name });
        }

        await SystemLog.create({
            user: req.user._id,
            action: 'STUDENT_EDITED',
            details: `Updated fields: ${changedFields.join(', ')} for ${student.studentId}`,
            ipAddress: req.ip
        });

        res.json({ success: true, data: student, warning: changedFields.includes('class') ? 'Class changed. Reset fee structure link.' : null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    3. TOGGLE NETWORK STATUS
exports.toggleStudentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        student.status = status;
        await student.save();

        const isActive = status.toLowerCase() === 'active';
        await User.findByIdAndUpdate(student.user, { isActive });

        await SystemLog.create({
            user: req.user._id,
            action: 'STATUS_TOGGLED',
            details: `Student ${student.studentId} network status forced to ${status}`,
            ipAddress: req.ip
        });

        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    6. GENERATE ID CARD -> PDF Buffer
exports.generateStudentIdCard = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user', 'name');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const mockPdfBuffer = Buffer.from(`%PDF-1.4\n%Mock ID Card for ${student.user.name}\n\n% Initialize PDFKit for actual generation.`);
        
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=ID_${student.studentId}.pdf`,
            'Content-Length': mockPdfBuffer.length
        });
        
        res.send(mockPdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    7. DELETE (SOFT)
exports.deleteStudent = async (req, res) => {
    try {
        const { confirmation } = req.body;
        if (confirmation !== 'DELETE') {
            return res.status(400).json({ success: false, message: 'Verification phrase "DELETE" is required' });
        }

        const student = await Student.findByIdAndUpdate(req.params.id, { 
            isDeleted: true, 
            deletedAt: new Date() 
        }, { new: true });

        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        await User.findByIdAndUpdate(student.user, { isActive: false });

        await SystemLog.create({
            user: req.user._id,
            action: 'STUDENT_DELETED',
            details: `Administratively soft-deleted identity node ${student.studentId}`,
            ipAddress: req.ip
        });

        res.json({ success: true, message: 'Student record securely soft-deleted and credentials revoked.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Download student bulk import Excel template
exports.downloadBulkTemplate = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Students');

        // Define headers
        const headers = [
            'Full Name*', 'Academic Email*', 'Class*', 'Section*', 'Roll Number', 
            'Gender*', 'Date of Birth*', 'Guardian Name*', 'Guardian Phone*', 
            'Guardian Email', 'Address', 'Blood Group'
        ];

        sheet.addRow(headers);

        // Style headers
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4B5563' } // Slate-600 logic
        };

        // Add example row
        sheet.addRow([
            'Rahul Sharma', 'rahul.s@school.edu', 'Class 10', 'B', 'R-102',
            'MALE', '15/08/2008', 'Ramesh Sharma', '9876543210', 
            'ramesh@gmail.com', '123 MG Road, Delhi', 'B+'
        ]);

        // Auto-width columns
        sheet.columns.forEach(column => {
            column.width = 20;
        });

        // Add second sheet for instructions
        const instructionsSheet = workbook.addWorksheet('Instructions');
        instructionsSheet.addRow(['Field', 'Requirement', 'Valid Values / Format']);
        instructionsSheet.getRow(1).font = { bold: true };
        
        const instructions = [
            ['Full Name', 'Mandatory', '2-100 characters, letters only'],
            ['Academic Email', 'Mandatory', 'Must be unique, valid email format'],
            ['Class', 'Mandatory', 'Existing class name (e.g., Class 10)'],
            ['Section', 'Mandatory', 'Available section (A, B, C, etc.)'],
            ['Gender', 'Mandatory', 'MALE, FEMALE, or OTHER'],
            ['Date of Birth', 'Mandatory', 'DD/MM/YYYY format'],
            ['Guardian Phone', 'Mandatory', '10 digits'],
            ['*', 'Note', 'Indicates mandatory fields']
        ];
        
        instructions.forEach(row => instructionsSheet.addRow(row));
        instructionsSheet.columns.forEach(column => {
            column.width = 25;
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=student_bulk_template.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get bulk data specifications for the frontend import wizard
exports.getBulkDataSpecs = async (req, res) => {
    try {
        const classes = await Class.find({ schoolId: req.user.schoolId, isActive: true }).select('name sections');
        const settings = await SchoolSetting.findOne({ schoolId: req.user.schoolId });

        res.json({
            success: true,
            data: {
                version: "1.0",
                lastUpdated: new Date().toISOString().split('T')[0],
                academicYear: settings?.academicYear || 'Current Year',
                fileFormat: ".xlsx only",
                maxRows: 500,
                fields: [
                    { name: "Full Name", required: true, type: "string", rules: "2-100 chars, letters only" },
                    { name: "Academic Email", required: true, type: "email", rules: "must be unique, valid format" },
                    { name: "Class", required: true, type: "enum", validValues: classes.map(c => c.name) },
                    { name: "Section", required: true, type: "enum", validValues: ["A", "B", "C", "D"] },
                    { name: "Roll Number", required: false, type: "string", rules: "auto-generated if empty" },
                    { name: "Gender", required: true, type: "enum", validValues: ["MALE", "FEMALE", "OTHER"] },
                    { name: "Date of Birth", required: true, type: "date", rules: "DD/MM/YYYY format" },
                    { name: "Guardian Name", required: true, type: "string", rules: "2-100 chars" },
                    { name: "Guardian Phone", required: true, type: "string", rules: "10 digits, no spaces" },
                    { name: "Guardian Email", required: false, type: "email", rules: "optional" },
                    { name: "Address", required: false, type: "string", rules: "max 250 chars" },
                    { name: "Blood Group", required: false, type: "enum", validValues: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] }
                ],
                errorHandling: "Invalid rows are skipped and listed in error report",
                duplicateHandling: "Rows with existing email are skipped with reason"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Process high-density bulk student migration (Excel)
exports.processBulkUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);

        const results = { total: 0, success: 0, failed: 0, skipped: 0 };
        const errors = [];
        const toInsertStudents = [];
        const toInsertUsers = [];
        const sectionIncrements = {}; 

        const year = new Date().getFullYear();
        let counter = await Counter.findOne({ id: 'studentId' });
        if (!counter) counter = await Counter.create({ id: 'studentId', seq: 0 });
        
        let currentSeq = counter.seq;

        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            if (!row.values[1]) continue; 

            results.total++;
            
            try {
                const name = row.getCell(1).value?.toString()?.trim();
                const email = row.getCell(2).value?.toString()?.trim()?.toLowerCase();
                const className = row.getCell(3).value?.toString()?.trim();
                const sectionName = row.getCell(4).value?.toString()?.trim();
                const rollNo = row.getCell(5).value?.toString()?.trim();
                const gender = row.getCell(6).value?.toString()?.trim()?.toUpperCase();
                const gName = row.getCell(8).value?.toString()?.trim();
                const gPhone = row.getCell(9).value?.toString()?.trim();

                if (!name || !email || !className || !sectionName || !gender || !gName || !gPhone) {
                    throw new Error('Missing mandatory fields');
                }
                if (!email.endsWith('@school.edu')) throw new Error('Invalid school domain');
                if (!['MALE', 'FEMALE', 'OTHER'].includes(gender)) throw new Error('Invalid gender');
                if (!/^\d{10}$/.test(gPhone)) throw new Error('Phone must be 10 digits');

                const cls = await Class.findOne({ name: className, schoolId: req.user.schoolId });
                if (!cls) throw new Error(`Class "${className}" not found`);

                const sec = cls.sections.find(s => s.name === sectionName);
                if (!sec) throw new Error(`Section "${sectionName}" not found in ${className}`);
                if (sec.totalStudents >= sec.capacity) throw new Error(`Section ${sectionName} is full`);

                const existing = await User.findOne({ email });
                if (existing) {
                    results.skipped++;
                    errors.push({ row: i, field: 'Email', reason: 'Duplicate entry skipped' });
                    continue;
                }

                currentSeq++;
                const studentId = `STU${year}${currentSeq.toString().padStart(4, '0')}`;
                
                // Mongoose ObjectId manually generated to link User & Student
                const userId = new mongoose.Types.ObjectId();
                const tempPassword = crypto.randomBytes(4).toString('hex');
                const hashedPassword = bcrypt.hashSync(tempPassword, 10);
                
                toInsertUsers.push({
                    _id: userId,
                    name,
                    email,
                    password: hashedPassword,
                    role: 'student',
                    schoolId: req.user.schoolId,
                    isActive: true
                });

                toInsertStudents.push({
                    user: userId,
                    studentId,
                    name,
                    classId: cls._id,
                    sectionId: sec._id,
                    rollNumber: rollNo || `${className.replace('Class ', '')}${sectionName}${String(sec.totalStudents + 1).padStart(3, '0')}`,
                    gender,
                    parentName: gName,
                    parentPhone: gPhone,
                    schoolId: req.user.schoolId,
                    admissionDate: new Date()
                });

                const secKey = `${cls._id}_${sec._id}`;
                sectionIncrements[secKey] = (sectionIncrements[secKey] || 0) + 1;
                
                results.success++;

            } catch (err) {
                results.failed++;
                errors.push({ row: i, field: 'System', reason: err.message });
            }
        }

        if (toInsertUsers.length > 0) {
            await User.insertMany(toInsertUsers, { ordered: false });
            await Student.insertMany(toInsertStudents, { ordered: false });
            
            for (const [key, inc] of Object.entries(sectionIncrements)) {
                const [classRef, sectionRef] = key.split('_');
                await Class.updateOne(
                    { _id: classRef, "sections._id": sectionRef },
                    { $inc: { "sections.$.totalStudents": inc } }
                );
            }

            await Counter.updateOne({ id: 'studentId' }, { seq: currentSeq });
        }

        await SystemLog.create({
            user: req.user._id,
            action: 'BULK_MIGRATION',
            details: `Imported ${results.success} students, ${results.failed} errors`,
            ipAddress: req.ip
        });

        res.json({
            success: true,
            data: {
                totalRows: results.total,
                successCount: results.success,
                failedCount: results.failed,
                skippedCount: results.skipped,
                errors: errors.slice(0, 20),
                message: results.failed > 0 ? "Migration partial complete with errors" : "Bulk migration complete"
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

