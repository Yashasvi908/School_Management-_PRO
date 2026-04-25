const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    action: { type: String, required: true },
    details: { type: Object },
    ip: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    schoolId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SystemLog', systemLogSchema);
