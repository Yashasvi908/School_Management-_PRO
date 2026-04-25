const Student = require('../../models/Student');
const FeePayment = require('../../models/FeePayment');
const Attendance = require('../../models/Attendance');

exports.getOverview = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        // 1. Enrollment Trend (Last 6 Months)
        const enrollmentTrend = await Student.aggregate([
            { $match: { schoolId } },
            { $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }},
            { $sort: { "_id": 1 } }
        ]);

        // 2. Fee Collection Trend
        const feeTrend = await FeePayment.aggregate([
            { $match: { schoolId } },
            { $group: {
                _id: { $month: "$paidAt" },
                collected: { $sum: "$amount" }
            }},
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            data: {
                studentEnrollmentTrend: enrollmentTrend,
                feeCollectionTrend: feeTrend,
                attendanceTrend: [] // Needs complex aggregation
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
