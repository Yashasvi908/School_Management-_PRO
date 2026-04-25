const SchoolSetting = require('../../models/SchoolSetting');

// @desc    Get school settings
// @route   GET /api/admin/settings/school
exports.getSettings = async (req, res) => {
    try {
        let settings = await SchoolSetting.findOne({ schoolId: req.user.schoolId });
        if (!settings) {
            settings = await SchoolSetting.create({ 
                name: 'Your School Name', 
                schoolId: req.user.schoolId 
            });
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update school settings
// @route   PUT /api/admin/settings/school
exports.updateSettings = async (req, res) => {
    try {
        const settings = await SchoolSetting.findOneAndUpdate(
            { schoolId: req.user.schoolId },
            req.body,
            { new: true, upsert: true }
        );
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
