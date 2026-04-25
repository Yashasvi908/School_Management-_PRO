const Notice = require('../models/Notice');
const Event = require('../models/Event');

// NOTICE HANDLERS
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ 
            schoolId: req.user.schoolId,
            $or: [{ targetRoles: req.user.role }, { targetRoles: 'all' }] 
        }).sort({ createdAt: -1 });
        res.json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createNotice = async (req, res) => {
    try {
        const notice = await Notice.create({ 
            ...req.body, 
            createdBy: req.user.id,
            schoolId: req.user.schoolId 
        });
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// EVENT HANDLERS
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ schoolId: req.user.schoolId }).sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, schoolId: req.user.schoolId });
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
