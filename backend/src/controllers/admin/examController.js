const Mark = require('../../models/ExamMark');
const Exam = require('../../models/Exam');
const Student = require('../../models/Student');
const ExcelJS = require('exceljs');

exports.createExam = async (req, res) => {
    try {
        const exam = new Exam({
            ...req.body,
            schoolId: req.user.schoolId
        });
        await exam.save();
        res.status(201).json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 });
        res.json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addMarks = async (req, res) => {
    try {
        const { examId, marks } = req.body; // marks array: [{ studentId, subjectId, marksObtained, maxMarks }]
        
        const markRecords = marks.map(m => ({
            exam: examId,
            student: m.studentId,
            subject: m.subjectId,
            marksObtained: m.marksObtained,
            maxMarks: m.maxMarks,
            schoolId: req.user.schoolId
        }));

        // Upsert marks (update if exists, insert if not)
        for (const record of markRecords) {
            await Mark.findOneAndUpdate(
                { exam: record.exam, student: record.student, subject: record.subject },
                record,
                { upsert: true, new: true }
            );
        }

        res.json({ success: true, message: 'Marks Synchronized Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getExamAnalytics = async (req, res) => {
    try {
        const { examId } = req.params;
        const marks = await Mark.find({ exam: examId, schoolId: req.user.schoolId });

        if (!marks.length) {
            return res.json({ success: true, analytics: null });
        }

        const stats = {
            'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D/F': 0,
            totalMarks: 0,
            passed: 0
        };

        marks.forEach(m => {
            const percentage = (m.marksObtained / m.maxMarks) * 100;
            stats.totalMarks += percentage;

            if (percentage >= 90) stats['A+']++;
            else if (percentage >= 80) stats['A']++;
            else if (percentage >= 70) stats['B+']++;
            else if (percentage >= 60) stats['B']++;
            else if (percentage >= 45) stats['C']++;
            else stats['D/F']++;

            if (percentage >= 33) stats.passed++;
        });

        const analytics = {
            gradeDistribution: [
                { grade: 'A+', students: stats['A+'], color: '#10b981' },
                { grade: 'A', students: stats['A'], color: '#34d399' },
                { grade: 'B+', students: stats['B+'], color: '#6366f1' },
                { grade: 'B', students: stats['B'], color: '#8b5cf6' },
                { grade: 'C', students: stats['C'], color: '#f59e0b' },
                { grade: 'D/F', students: stats['D/F'], color: '#f43f5e' },
            ],
            schoolAvgScore: (stats.totalMarks / marks.length).toFixed(1) + '%',
            passPercentage: ((stats.passed / marks.length) * 100).toFixed(1) + '%',
        };

        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkUploadMarks = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Select Excel File first' });

        const workbook = new ExcelJS.Workbook();
        const isCsv = req.file.originalname.toLowerCase().endsWith('.csv');
        
        if (isCsv) {
            await workbook.csv.load(req.file.buffer.toString());
        } else {
            await workbook.xlsx.load(req.file.buffer);
        }
        
        const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
        
        const { examId, subjectId } = req.body;
        const marksRecords = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip Header
                // Handle different ways row values might come through
                const studentId = (row.getCell(1).value?.toString() || '').trim();
                const marksValue = row.getCell(3).value;
                const marksObtained = Number(typeof marksValue === 'object' ? marksValue.result : marksValue);

                if (studentId && !isNaN(marksObtained)) {
                    marksRecords.push({
                        studentId,
                        marksObtained,
                        maxMarks: 100
                    });
                }
            }
        });

        console.log(`[BulkUpload] Processing ${marksRecords.length} records...`);
        let count = 0;
        // Loop students and find by studentId
        for (const record of marksRecords) {
            const student = await Student.findOne({ studentId: record.studentId, schoolId: req.user.schoolId });
            if (student) {
                await Mark.findOneAndUpdate(
                    { exam: examId, student: student._id, subject: subjectId },
                    {
                        marksObtained: record.marksObtained,
                        maxMarks: record.maxMarks,
                        schoolId: req.user.schoolId
                    },
                    { upsert: true }
                );
                count++;
            } else {
                console.log(`[BulkUpload] Student not found: ${record.studentId}`);
            }
        }

        res.json({ success: true, message: `Successfully synchronized ${count} student nodes. ${marksRecords.length - count} failed.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getClassReportCards = async (req, res) => {
    try {
        const { examId, classId } = req.query;
        const schoolId = req.user.schoolId;

        // Fetch students in class
        const students = await Student.find({ classId, schoolId }).populate('user', 'name');
        
        // Fetch all marks for this exam
        const marks = await Mark.find({ exam: examId, schoolId }).populate('subject', 'name code');

        const reportData = students.map(student => {
            const studentMarks = marks.filter(m => m.student.toString() === student._id.toString());
            return {
                student: {
                    id: student.studentId,
                    name: student.user.name,
                    roll: student.rollNumber
                },
                marks: studentMarks.map(m => ({
                    subject: m.subject.name,
                    obtained: m.marksObtained,
                    max: m.maxMarks
                }))
            };
        });

        res.json({ success: true, data: reportData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        // Also delete marks associated with this exam
        await Mark.deleteMany({ exam: req.params.id });
        res.json({ success: true, message: 'Exam and associated marks deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMarksByExamAndSubject = async (req, res) => {
    try {
        const { examId, subjectId } = req.query;
        const marks = await Mark.find({ 
            exam: examId, 
            subject: subjectId, 
            schoolId: req.user.schoolId 
        });
        
        // Map to { studentId: marksObtained } for easy frontend usage
        const markMap = {};
        marks.forEach(m => {
            markMap[m.student.toString()] = m.marksObtained;
        });

        res.json({ success: true, data: markMap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
