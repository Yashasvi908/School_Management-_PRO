const Teacher = require('../../models/Teacher');
const User = require('../../models/User');
const Counter = require('../../models/Counter');

exports.registerTeacher = async (req, res) => {
    try {
        const { name, email, subjectExpertise, experience, qualifications } = req.body;
        
        const year = new Date().getFullYear();
        const counter = await Counter.findOneAndUpdate({ id: 'teacherId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const teacherId = `TCH${year}${counter.seq.toString().padStart(4, '0')}`;
        const tempPassword = Math.random().toString(36).slice(-8);

        const user = await User.create({
            name, email, password: tempPassword, role: 'teacher', schoolId: req.user.schoolId
        });

        const teacher = await Teacher.create({
            user: user._id, employeeId: teacherId, subjects: subjectExpertise.split(',').map(s => s.trim()), experience, qualification: qualifications, schoolId: user.schoolId
        });

        res.status(201).json({ success: true, data: { teacherId, password: tempPassword, name, email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ schoolId: req.user.schoolId }).populate('user', 'name email');
        res.json({ success: true, data: teachers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
