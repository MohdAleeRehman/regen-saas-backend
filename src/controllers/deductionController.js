const Deduction = require("../models/Deduction");

// Add a new deduction configuration
const addDeduction = async (req, res) => {
  try {
    const {
      deviceId,
      channelId,
      storageOptions,
      isFunctional,
      isRepaired,
      conditionGrading,
      ptaApproved,
      accessories,
    } = req.body;

    if (!deviceId || !channelId) {
      return res.status(400).json({ error: "Device ID and Channel ID are required" });
    }

    if (!storageOptions || !Array.isArray(storageOptions) || storageOptions.length === 0)
    {
      return res.status(400).json({ error: "At least one storage option is required" });
    }

    const deduction = new Deduction({
      deviceId,
      channelId,
      storageOptions,
      isFunctional,
      isRepaired,
      conditionGrading,
      ptaApproved,
      accessories,
    });

    await deduction.save();
    res.status(201).json(deduction);
  } catch (err) {
    res.status(500).json({ error: "Failed to add deduction", details: err.message });
  }
};

// Get deductions for a specific device and channel
const getDeductions = async (req, res) => {
  try {
    const { deviceId, channelId } = req.query;

    if (!deviceId || !channelId) {
      return res.status(400).json({ error: "Device ID and Channel ID are required" });
    }

    const deductions = await Deduction.find({ deviceId, channelId }).populate("deviceId channelId");
    res.status(200).json(deductions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deductions", details: err.message });
  }
};

// Update a deduction
const updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const deduction = await Deduction.findByIdAndUpdate(id, updates, { new: true });
    if (!deduction) {
      return res.status(404).json({ error: "Deduction not found" });
    }

    res.status(200).json(deduction);
  } catch (err) {
    res.status(500).json({ error: "Failed to update deduction", details: err.message });
  }
};

// Delete a deduction
const deleteDeduction = async (req, res) => {
  try {
    const { id } = req.params;

    const deduction = await Deduction.findByIdAndDelete(id);
    if (!deduction) {
      return res.status(404).json({ error: "Deduction not found" });
    }

    res.status(200).json({ message: "Deduction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete deduction", details: err.message });
  }
};

module.exports = {
  addDeduction,
  getDeductions,
  updateDeduction,
  deleteDeduction,
};
