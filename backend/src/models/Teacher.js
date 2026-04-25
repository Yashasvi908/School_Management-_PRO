const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    subjects: [{ type: String }],
    phone: { type: String },
    qualification: { type: String },
    experience: { type: Number },
    department: { type: String },
    leaveBalance: {
        cl: { type: Number, default: 12 },
        sl: { type: Number, default: 10 },
        el: { type: Number, default: 15 }
    },
    baseSalary: { type: Number, default: 0 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
