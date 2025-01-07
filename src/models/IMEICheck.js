const mongoose = require("mongoose");

const imeiCheckSchema = new mongoose.Schema(
  {
    imei: { type: String, required: true, unique: true },
    status: { type: String, enum: ["clean", "blacklisted"], required: true },
    manufacturer: { type: String },
    modelName: { type: String },
    blacklistRecords: { type: Number },
    gsmaBlacklisted: { type: Boolean },
    generalListStatus: { type: Boolean },
    result: { type: Object, required: true }, // Store the entire result object
  },
  { timestamps: true }
);

module.exports = mongoose.model("IMEICheck", imeiCheckSchema);
