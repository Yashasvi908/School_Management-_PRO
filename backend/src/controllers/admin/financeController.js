const FeeStructure = require('../../models/FeeStructure');
const FeePayment = require('../../models/FeePayment');

exports.getFeeStructures = async (req, res) => {
    try {
        const structures = await FeeStructure.find({ schoolId: req.user.schoolId });
        res.json({ success: true, data: structures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createFeeStructure = async (req, res) => {
    try {
        const structure = await FeeStructure.create({ 
            ...req.body, 
            schoolId: req.user.schoolId 
        });
        res.status(201).json({ success: true, data: structure });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFinanceReports = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const totalRevenue = await FeePayment.aggregate([
            { $match: { schoolId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const monthlyCollection = await FeePayment.aggregate([
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
                totalRevenue: totalRevenue[0]?.total || 0,
                monthlyCollection 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
