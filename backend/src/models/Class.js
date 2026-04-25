const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    gradeNumber: { type: Number, required: true },
    name: { type: String, required: true },
    sections: [{
        name: { type: String, required: true },
        classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        totalStudents: { type: Number, default: 0 },
        capacity: { type: Number, default: 40 },
        isActive: { type: Boolean, default: true }
    }],
    classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    academicYear: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
