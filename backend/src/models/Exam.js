const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['unit', 'mid', 'final'], required: true },
    class: { type: String, required: true },
    academicYear: { type: String, required: true },
    subjects: [{
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        date: { type: Date },
        duration: { type: String },
        maxMarks: { type: Number, default: 100 },
        minMarks: { type: Number, default: 33 }
    }],
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
