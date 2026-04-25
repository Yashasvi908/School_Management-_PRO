const mongoose = require('mongoose');

const salaryDeductionFlagSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: Date, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    reason: { type: String, enum: ['absent', 'half-day', 'late-excess'], required: true },
    deductDays: { type: Number, default: 0 }, // 1.0 for full day, 0.5 for half day
    schoolId: { type: String, required: true }
}, { timestamps: true });

salaryDeductionFlagSchema.index({ teacherId: 1, month: 1, year: 1 });

module.exports = mongoose.model('SalaryDeductionFlag', salaryDeductionFlagSchema);
