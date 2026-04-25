const mongoose = require('mongoose');

const schoolSettingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    academicYear: { type: String },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    notifications: {
        emailEnabled: { type: Boolean, default: true },
        smsEnabled: { type: Boolean, default: false },
        pushEnabled: { type: Boolean, default: true }
    },
    schoolId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('SchoolSetting', schoolSettingSchema);
