const mongoose = require('mongoose');

const DeductionSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    storageOptions: [
        {
            variant: { type: String, required: true },
            deduction: { type: Number, required: true },
        },
    ],
    isFunctional: { type: Number, required: true },
    isRepaired: { type: Number, required: true },
    conditionGrading: {
        Excellent: { type: Number, default: 0 },
        Good: { type: Number, default: 0 },
        Fair: { type: Number, default: 0 },
    },
    ptaApproved: { type: Number, required: true },
    accessories: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deduction', DeductionSchema);