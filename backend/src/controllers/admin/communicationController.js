const Message = require('../../models/Message');
const User = require('../../models/User');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, type } = req.body;
        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
            messageType: type || 'text',
            schoolId: req.user.schoolId
        });
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        // Group messages to find unique contacts
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
            schoolId: req.user.schoolId
        }).sort({ createdAt: -1 });

        const contacts = [];
        const seen = new Set();

        for (const msg of messages) {
            const otherId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
            if (!seen.has(otherId)) {
                seen.add(otherId);
                const user = await User.findById(otherId).select('name role email');
                contacts.push({ user, lastMessage: msg.content, time: msg.createdAt });
            }
        }

        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { otherId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherId },
                { sender: otherId, receiver: req.user.id }
            ],
            schoolId: req.user.schoolId
        }).sort({ createdAt: 1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getGlobalDirectory = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const userId = req.user.id;
        
        // Fetch all active users in the school except the current admin
        const users = await User.find({ 
            schoolId, 
            _id: { $ne: userId }
        }).select('name role email avatar');

        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
