const Device = require('../models/Device');
const Deduction = require('../models/Deduction');

// get devices for a channel
const getChannelDevices = async (req, res) => {
    try {
        const channelId = req.channel._id;
        const devices = await Device.find({ channel: channelId });
        res.status(200).json(devices);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch devices", details: err.message });
    }
};

// get deductions for a specific device
const getDeductionsForDevice = async (req, res) => {
    try {
        const channelId = req.channel._id;
        const { deviceId } = req.params;

        const deductions = await Deduction.findOne({ deviceId, channelId }).populate("deviceId");
        if (!deductions) {
            return res.status(404).json({ error: "Deductions not found for this device and channel" });
        }

        res.status(200).json(deductions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch deductions", details: err.message });
    }
};

module.exports = { getChannelDevices, getDeductionsForDevice };