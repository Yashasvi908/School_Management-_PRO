const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    occupation: { type: String },
    address: { type: String },
    schoolId: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Parent', parentSchema);
