const LeaveApplication = require('../models/LeaveApplication');
const LeaveBalance = require('../models/LeaveBalance');
const Attendance = require('../models/Attendance');

// @desc    Apply for leave
exports.applyLeave = async (req, res) => {
    try {
        const { type, fromDate, toDate, reason, totalDays, attendeeType } = req.body;
        
        const leave = await LeaveApplication.create({
            applicant: req.user.id,
            userModel: attendeeType === 'teacher' ? 'Teacher' : 'Staff',
            type,
            fromDate,
            toDate,
            totalDays,
            reason,
            schoolId: req.user.schoolId
        });

        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all leave requests
exports.getLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveApplication.find({ schoolId: req.user.schoolId })
            .populate('applicant', 'name email')
            .sort('-createdAt');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update leave status
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const leave = await LeaveApplication.findById(id);
        if (!leave) return res.status(404).json({ success: false, message: 'Request not found' });

        leave.status = status;
        await leave.save();

        if (status === 'Approved') {
            // Deduct from LeaveBalance
            const balance = await LeaveBalance.findOne({ employee: leave.applicant });
            if (balance) {
                const leaveKey = leave.type.toLowerCase();
                if (balance[leaveKey] !== undefined) {
                    balance[leaveKey] -= leave.totalDays;
                    await balance.save();
                }
            }

            // Sync Attendance
            const start = new Date(leave.fromDate);
            const end = new Date(leave.toDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                await Attendance.findOneAndUpdate(
                    { attendee: leave.applicant, date: new Date(d), schoolId: leave.schoolId },
                    { 
                        status: 'leave', 
                        remark: `Leave: ${leave.type}`, 
                        type: leave.userModel.toLowerCase(),
                        userModel: leave.userModel,
                        markedBy: req.user.id,
                        schoolId: leave.schoolId 
                    },
                    { upsert: true }
                );
            }
        }

        res.json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
