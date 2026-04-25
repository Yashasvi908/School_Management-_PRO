const mongoose = require('mongoose');

const attendanceSettingsSchema = new mongoose.Schema({
    minAttendance: { type: Number, default: 75 },
    autoAlertRules: {
        absent1DaySMS: { type: Boolean, default: true },
        absent3DaysEmail: { type: Boolean, default: true },
        below75Warning: { type: Boolean, default: true },
        below65AdminAlert: { type: Boolean, default: true }
    },
    workingDays: {
        monday: { type: Boolean, default: true },
        tuesday: { type: Boolean, default: true },
        wednesday: { type: Boolean, default: true },
        thursday: { type: Boolean, default: true },
        friday: { type: Boolean, default: true },
        saturday: { type: Boolean, default: true },
        sunday: { type: Boolean, default: false }
    },
    schoolId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceSettings', attendanceSettingsSchema);
