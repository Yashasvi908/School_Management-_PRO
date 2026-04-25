const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, unique: true },
    class: { type: String }, // Legacy, used by bulk imports currently
    section: { type: String }, // Legacy
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    sectionId: { type: mongoose.Schema.Types.ObjectId },
    rollNumber: { type: String },
    name: { type: String, required: true },
    phone: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'OTHER' },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    schoolId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

// Text index for search
studentSchema.index({ name: 'text' });
// Unique compound index for roll numbers
studentSchema.index({ sectionId: 1, rollNumber: 1 }, { unique: true, partialFilterExpression: { sectionId: { $exists: true } } });

module.exports = mongoose.model('Student', studentSchema);
