const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['CORE', 'ELECTIVE', 'LAB'], default: 'CORE' },
    creditHours: { type: Number, default: 4 },
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    isActive: { type: Boolean, default: true },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
