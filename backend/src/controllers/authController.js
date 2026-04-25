const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { identifier, password, role } = req.body; 
        console.log(`[Auth Attempt] ID: ${identifier}, Role Select: ${role}`);

        let user;

        // 1. Try finding by email
        user = await User.findOne({ email: identifier });
        if(user) console.log(`[Auth] User document found by Email. Role: ${user.role}`);

        // 2. If not found, check if it's a Student ID or Roll Number
        if (!user) {
            const student = await Student.findOne({ $or: [{ studentId: identifier }, { rollNumber: identifier }] });
            if (student) {
                user = await User.findById(student.user);
                console.log(`[Auth] User document found by Student ID / Roll Number`);
            }
        }

        // 3. If still not found, check if it's a Teacher ID
        if (!user) {
            const teacher = await Teacher.findOne({ employeeId: identifier });
            if (teacher) {
                user = await User.findById(teacher.user);
                console.log(`[Auth] User document found by Teacher ID`);
            }
        }

        if (!user) {
            console.log(`[Auth Fail] No user found for: ${identifier}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`[Auth] Password match status: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, schoolId: user.schoolId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
exports.logoutUser = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Setup account / change password first time
// @route   POST /api/auth/setup-account
exports.setupAccount = async (req, res) => {
    try {
        const { schoolId, password, role } = req.body; 

        let user;

        if (role === 'student') {
            const student = await Student.findOne({ $or: [{ studentId: schoolId }, { rollNumber: schoolId }] });
            if (student) user = await User.findById(student.user);
        } else if (role === 'teacher') {
            const teacher = await Teacher.findOne({ employeeId: schoolId });
            if (teacher) user = await User.findById(teacher.user);
        } else if (role === 'parent') {
            const Parent = require('../models/Parent');
            const parent = await Parent.findOne({ parentId: schoolId });
            if (parent) user = await User.findById(parent.user);
        } else if (['accountant', 'librarian', 'staff'].includes(role)) {
            const Staff = require('../models/Staff');
            const staff = await Staff.findOne({ employeeId: schoolId });
            if (staff) user = await User.findById(staff.user);
        } else if (role === 'admin') {
            // Admin usually setup by email, but support ID setup if needed
            user = await User.findOne({ email: schoolId, role: 'admin' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Setup failed. Please check your ID.' });
        }

        user.password = password; // Will be hashed securely by Mongoose pre-save hook
        await user.save();

        res.json({ success: true, message: 'Password set successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
