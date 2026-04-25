const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String },
    targetAudience: [{ type: String }],
    isHoliday: { type: Boolean, default: false },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
