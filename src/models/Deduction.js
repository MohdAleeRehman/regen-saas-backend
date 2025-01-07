const mongoose = require("mongoose");

const DeductionSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  storageOptions: [
    {
      variant: { type: String, required: true },
      deduction: { type: Number, required: true },
    },
  ],
  colorOptions: [
    {
      color: { type: String, required: true },
      deduction: { type: Number, default: 0 },
    },
  ],
  simOptions: [
    {
      simVariant: { type: String },
      deduction: { type: Number, default: 0 },
    },
  ],
  isDamagedOptions: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
      deduction: { type: Number, required: true },
    },
  ],
  isFunctionalOptions: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
      deduction: { type: Number, required: true },
    },
  ],
  isRepairedOptions: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
      deduction: { type: Number, required: true },
    },
  ],
  cosmeticCondition: [
    {
      section: { type: String, required: true }, // e.g., "display", "back", "sides"
      grades: [
        {
          grade: { type: String, required: true }, // e.g., "Excellent", "Good"
          deduction: { type: Number, default: 0 },
          description: { type: String, default: "" },
        },
      ],
    },
  ],
  ptaApproved: { type: Number, required: true },
  factoryUnlocked: { type: Number, default: 0 },
  accessories: { type: Number, required: true },
  tradeInBonus: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deduction", DeductionSchema);
