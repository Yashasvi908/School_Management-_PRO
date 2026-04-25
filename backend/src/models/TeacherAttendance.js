const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], required: true },
    checkIn: { type: String },
    checkOut: { type: String },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
