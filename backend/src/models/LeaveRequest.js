const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    applicant: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
    userModel: { type: String, required: true, enum: ['Teacher', 'Staff'] },
    leaveType: { 
        type: String, 
        required: true, 
        enum: ['CL', 'SL', 'EL', 'ML', 'PL', 'LWP'] 
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    attachment: { type: String }, // URL to medical certificate etc.
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'] 
    },
    adminRemark: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
