const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    deviceType: { type: String, required: true },
    vendor: { type: String, required: true },
    basePrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);