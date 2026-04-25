const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');

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
        const totalAmount = req.body.components.reduce((sum, item) => sum + item.amount, 0);
        const structure = await FeeStructure.create({ 
            ...req.body, 
            totalAmount, 
            schoolId: req.user.schoolId 
        });
        res.status(201).json({ success: true, data: structure });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const receiptId = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payment = await FeePayment.create({ 
            ...req.body, 
            receiptId, 
            schoolId: req.user.schoolId 
        });
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
