const Mark = require('../../models/ExamMark');
const Exam = require('../../models/Exam');
const Student = require('../../models/Student');

exports.getMyResults = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

        // Fetch all exams for this student's class
        const exams = await Exam.find({ class: student.classId.name }).lean();
        
        const results = await Promise.all(exams.map(async (exam) => {
            const marks = await Mark.find({ 
                exam: exam._id, 
                student: student._id 
            }).populate('subject', 'name code').lean();

            const isComplete = marks.length >= (exam.subjects?.length || 0);

            return {
                examName: exam.name,
                examType: exam.type,
                isComplete,
                marks: marks.map(m => ({
                    subject: m.subject.name,
                    obtained: m.marksObtained,
                    max: m.maxMarks
                }))
            };
        }));

        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
