const mongoose = require('mongoose');

const substituteAlertSchema = new mongoose.Schema({
    absentTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    affectedPeriods: { type: Array, default: [] }, // Stores time slots and class details
    date: { type: Date, required: true },
    status: { type: String, enum: ['PENDING', 'ASSIGNED', 'RESOLVED'], default: 'PENDING' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SubstituteAlert', substituteAlertSchema);
