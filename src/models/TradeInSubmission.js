const mongoose = require('mongoose');

const TradeInSubmissionSchema = new mongoose.Schema({
    device: { type: String, required: true },
    basePrice: { type: Number, required: true },
    tradeInValue: { type: Number, required: true },
    tradeInBonus: { type: Number, default: 0 },
    finalTradeInValue: { type: Number, default: 0 },
    options: {
        storageSize: { type: String }, // Storage size selected
        color: { type: String }, // Color selected
        simVariant: { type: String }, // SIM variant selected
        isDamaged: { type: [String] }, // List of selected damages
        isFunctional: { type: [String] }, // List of selected functional issues
        isRepaired: { type: [String] }, // List of selected repairs
        cosmeticCondition: {
            display: { type: String }, // Display condition
            back: { type: String }, // Back condition
            sides: { type: String }, // Sides condition
        },
        ptaApproved: { type: String }, // PTA approval status
        factoryUnlocked: { type: String }, // Factory unlocked status (if applicable)
        accessories: { type: String }, // Accessories included or not
	serialNumber: { type: String },
    },
    channelName: { type: String, required: true }, // Channel name
    apiKey: { type: String, required: true }, // API key
    discountCode: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TradeInSubmission', TradeInSubmissionSchema);
