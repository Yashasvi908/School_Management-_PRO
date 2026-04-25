const User = require('../../models/User');
const SystemLog = require('../../models/SystemLog');

// @desc    Get all users for access management
// @route   GET /api/admin/system/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ schoolId: req.user.schoolId }).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user status (Activate/Deactivate)
// @route   PATCH /api/admin/system/users/:userId/status
exports.updateUserStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isActive: req.body.isActive },
            { new: true }
        );
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset user password
// @route   PATCH /api/admin/system/users/:userId/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const tempPassword = Math.random().toString(36).slice(-8);
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        user.password = tempPassword;
        await user.save();
        
        res.json({ success: true, message: 'Password reset successful', tempPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get system audit logs
// @route   GET /api/admin/system/logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await SystemLog.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 }).limit(100);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
