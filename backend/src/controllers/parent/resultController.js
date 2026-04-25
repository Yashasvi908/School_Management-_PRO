const Mark = require('../../models/ExamMark');
const Exam = require('../../models/Exam');
const Student = require('../../models/Student');
const Parent = require('../../models/Parent');

exports.getMyChildrenResults = async (req, res) => {
    try {
        // 1. Find the parent profile linked to this user
        const parent = await Parent.findOne({ user: req.user._id }).populate('students');
        if (!parent) return res.status(404).json({ success: false, message: 'Parent profile not found' });

        const childrenResults = await Promise.all(parent.students.map(async (studentId) => {
            const student = await Student.findById(studentId).populate('user', 'name');
            if (!student) return null;

            // Fetch exams for the student's class
            const exams = await Exam.find({ class: student.classId.name }).lean();

            const examResults = await Promise.all(exams.map(async (exam) => {
                const marks = await Mark.find({ 
                    exam: exam._id, 
                    student: student._id 
                }).populate('subject', 'name code').lean();

                const isComplete = marks.length >= (exam.subjects?.length || 0);

                return {
                    examName: exam.name,
                    isComplete,
                    marks: marks.map(m => ({
                        subject: m.subject.name,
                        obtained: m.marksObtained,
                        max: m.maxMarks
                    }))
                };
            }));

            return {
                studentId: student._id,
                studentName: student.user.name,
                results: examResults
            };
        }));

        res.json({ success: true, data: childrenResults.filter(r => r !== null) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
