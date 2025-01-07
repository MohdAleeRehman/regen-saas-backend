const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: [
    {
      type: String,
      enum: ["Access Pricing Engine", "Access Analytics", "Submit Trade-Ins"],
    },
  ],
  quota: { type: Number, default: 1000 }, // Total quota
  quotaUsed: { type: Number, default: 0 }, // Used quota
  vendors: [{ type: String }],
  status: { type: String, default: "Offline" }, // Online/Offline
});



module.exports = mongoose.model("Channel", ChannelSchema);
