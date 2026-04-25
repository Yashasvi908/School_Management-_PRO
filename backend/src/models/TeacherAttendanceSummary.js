const mongoose = require('mongoose');

const teacherAttendanceSummarySchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    halfDay: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

teacherAttendanceSummarySchema.index({ teacherId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('TeacherAttendanceSummary', teacherAttendanceSummarySchema);
