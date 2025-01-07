const Device = require('../models/Device');
const Deduction = require('../models/Deduction');
const Channel = require('../models/Channel');

const getChannelDevices = async (req, res) => {
    try {
        const channelId = req.channel._id;

        // Step 1: Fetch the channel to get allowed vendors
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        // Step 2: Fetch all devices for allowed vendors
        const allowedVendors = channel.vendors || [];
        const allDevices = await Device.find({ vendor: { $in: allowedVendors } });

        // Step 3: Fetch all deductions for the channel
        const deductions = await Deduction.find({ channelId });

        // Step 4: Match devices with deductions
        const matchedDevices = allDevices.filter(device =>
            deductions.some(deduction =>
                deduction.deviceId.toString() === device._id.toString()
            )
        );

        // Step 5: Respond with matched devices
        res.status(200).json(matchedDevices);
    } catch (err) {
        console.error("Error fetching devices:", err);
        res.status(500).json({ error: "Failed to fetch devices", details: err.message });
    }
};

// Get deductions for a specific device
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
        console.error("Error fetching deductions:", err);
        res.status(500).json({ error: "Failed to fetch deductions", details: err.message });
    }
};

module.exports = { getChannelDevices, getDeductionsForDevice };
