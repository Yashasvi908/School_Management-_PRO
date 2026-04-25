const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['National', 'Seasonal', 'Restricted', 'Other'], default: 'National' },
    description: { type: String },
    schoolId: { type: String, required: true }
}, { timestamps: true });

// Index for performance
holidaySchema.index({ date: 1, schoolId: 1 });

module.exports = mongoose.model('Holiday', holidaySchema);
