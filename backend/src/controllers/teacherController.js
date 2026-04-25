const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const LeaveApplication = require('../models/LeaveApplication');

// @desc    Get teacher dashboard stats
// @route   GET /api/teacher/dashboard/stats
exports.getTeacherStats = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.user._id });
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        }

        // In a real system, we would filter students by classes assigned to this teacher
        // For now, we show school-wide stats if no classes assigned
        const totalStudents = await Student.countDocuments({ schoolId: req.user.schoolId });
        const pendingLeaves = await LeaveApplication.countDocuments({ 
            status: 'pending', 
            schoolId: req.user.schoolId 
        });

        res.json({
            success: true,
            data: {
                totalStudents,
                pendingLeaves,
                attendanceRate: '98%', // Placeholder
                todayClasses: 4 // Placeholder
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get classes for a teacher
// @route   GET /api/teacher/classes
exports.getTeacherClasses = async (req, res) => {
    try {
        // Find classes where this teacher is assigned (as class teacher or subject teacher)
        // For now, we return all classes in their school
        const classes = await Class.find({ schoolId: req.user.schoolId });
        
        res.json({
            success: true,
            data: classes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get students for a specific class
// @route   GET /api/teacher/classes/:classId/students
exports.getClassStudents = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const students = await Student.find({ 
            $or: [{ classId }, { class: classId }], 
            schoolId: req.user.schoolId 
        }).populate('user', 'name email avatar');

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
