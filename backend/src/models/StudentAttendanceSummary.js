const mongoose = require('mongoose');

const studentAttendanceSummarySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    leave: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

// Compound index for fast lookups
studentAttendanceSummarySchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendanceSummary', studentAttendanceSummarySchema);
