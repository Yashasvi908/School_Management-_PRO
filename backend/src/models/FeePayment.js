const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, enum: ['cash', 'upi', 'card', 'bank'], required: true },
    components: [String],
    paidAt: { type: Date, default: Date.now },
    receiptId: { type: String, unique: true },
    status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
