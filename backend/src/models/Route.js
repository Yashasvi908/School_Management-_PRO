const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stops: [{
        name: { type: String },
        time: { type: String }
    }],
    vehicleNumber: { type: String },
    driverName: { type: String },
    driverPhone: { type: String },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
