const mongoose = require('mongoose');

const examMarkSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    isAbsent: { type: Boolean, default: false },
    remarks: { type: String },
    schoolId: { type: String, required: true }
}, { timestamps: true });

examMarkSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('ExamMark', examMarkSchema);
