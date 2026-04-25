const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema({
    applicant: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
    userModel: { type: String, required: true, enum: ['Teacher', 'Staff'] },
    type: { 
        type: String, 
        required: true, 
        enum: ['CL', 'SL', 'EL', 'ML', 'PL', 'LWP'] 
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'] 
    },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LeaveApplication', leaveApplicationSchema);
