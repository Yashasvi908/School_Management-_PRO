const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    targetRoles: [{ type: String }],
    priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
