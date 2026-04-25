const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionName: { type: String, required: true }, // E.g., 'A', 'B'
    academicYear: { type: String, required: true },
    day: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true 
    },
    slots: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        startTime: { type: String, required: true }, // E.g., '08:00'
        endTime: { type: String, required: true },   // E.g., '09:00'
        roomNumber: { type: String },
        type: { type: String, enum: ['LECTURE', 'LAB', 'BREAK', 'EVENT'], default: 'LECTURE' }
    }],
    schoolId: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
