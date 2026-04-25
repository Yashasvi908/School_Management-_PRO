const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    type: { type: String, enum: ['student', 'teacher', 'staff'], default: 'student', required: true },
    attendee: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
    userModel: { type: String, required: true, enum: ['Student', 'Teacher', 'Staff'] },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave', 'half-day'], required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    remark: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'] },
    overtime: { type: Number, default: 0 },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: String, required: true }
}, { timestamps: true });

attendanceSchema.index({ attendee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
