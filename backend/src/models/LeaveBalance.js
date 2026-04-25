const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
    userModel: { type: String, required: true, enum: ['Teacher', 'Staff'] },
    cl: { type: Number, default: 12 },
    sl: { type: Number, default: 10 },
    el: { type: Number, default: 15 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
