const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], required: true },
    remark: { type: String },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);
