const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], required: true },
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'] },
    overtime: { type: Number, default: 0 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
