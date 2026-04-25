const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    role: { type: String, required: true }, // Clerk, Guard, Sweeper, etc.
    department: { type: String },
    salary: { type: Number },
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
