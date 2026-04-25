const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    class: { type: String, required: true },
    academicYear: { type: String, required: true },
    components: [{
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
        isOptional: { type: Boolean, default: false }
    }],
    totalAmount: { type: Number, required: true },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
