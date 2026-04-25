const Parent = require('../../models/Parent');
const User = require('../../models/User');
const Student = require('../../models/Student');
const ExcelJS = require('exceljs');
const bcrypt = require('bcryptjs');

// Get all parents
exports.getParents = async (req, res) => {
    try {
        const parents = await Parent.find({ schoolId: req.user.schoolId })
            .populate('user', 'name email avatar')
            .populate('students', 'name studentId class')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper to generate next Sequential Parent ID
const generateParentId = async (schoolId) => {
    const currentYear = new Date().getFullYear();
    const lastParent = await Parent.findOne({ schoolId }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastParent && lastParent.parentId && lastParent.parentId.startsWith(`PRN${currentYear}`)) {
        const lastSequence = parseInt(lastParent.parentId.slice(-4));
        if (!isNaN(lastSequence)) sequence = lastSequence + 1;
    }
    
    return `PRN${currentYear}${sequence.toString().padStart(4, '0')}`;
};

// Bulk Import Parents from Excel
exports.importParents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an excel file' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);
        
        const parentsToCreate = [];
        const errors = [];

        // Start sequence for this batch
        let nextIdBase = await generateParentId(req.user.schoolId);
        let idSequence = parseInt(nextIdBase.slice(-4));
        const yearPrefix = nextIdBase.slice(0, 7); // PRN2026

        // Iterate rows (skip header)
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const parentData = {
                name: row.getCell(1).value,
                email: row.getCell(2).value,
                phone: row.getCell(3).value?.toString(),
                studentId: row.getCell(4).value?.toString(),
                occupation: row.getCell(5).value,
                address: row.getCell(6).value,
            };

            if (!parentData.name || !parentData.email) continue;

            try {
                // Generate current ID for this row
                const currentParentId = `${yearPrefix}${idSequence.toString().padStart(4, '0')}`;
                idSequence++;

                // 1. Create User account
                const hashedPassword = await bcrypt.hash('Parent@123', 10);
                const user = await User.create({
                    name: parentData.name,
                    email: parentData.email,
                    password: hashedPassword,
                    role: 'parent',
                    schoolId: req.user.schoolId
                });

                // 2. Find linked student
                const student = await Student.findOne({ studentId: parentData.studentId, schoolId: req.user.schoolId });

                // 3. Create Parent Profile
                const parent = await Parent.create({
                    user: user._id,
                    parentId: currentParentId,
                    phone: parentData.phone,
                    students: student ? [student._id] : [],
                    occupation: parentData.occupation,
                    address: parentData.address,
                    schoolId: req.user.schoolId
                });

                parentsToCreate.push(parent);
            } catch (err) {
                errors.push({ row: i, error: err.message });
            }
        }

        res.json({ 
            success: true, 
            message: `Successfully imported ${parentsToCreate.length} parents`,
            failed: errors.length,
            errors 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteParent = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) return res.status(404).json({ success: false, message: 'Parent not found' });

        await User.findByIdAndDelete(parent.user);
        await Parent.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Parent account deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
