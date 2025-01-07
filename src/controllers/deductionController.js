const Deduction = require("../models/Deduction");

// Add a new deduction configuration
const addDeduction = async (req, res) => {
  try {
    const {
      deviceId,
      channelId,
      storageOptions,
      colorOptions,
      simOptions,
      isDamagedOptions,
      isFunctionalOptions,
      isRepairedOptions,
      cosmeticCondition,
      ptaApproved,
      factoryUnlocked,
      accessories,
      tradeInBonus,
    } = req.body;

    if (!deviceId || !channelId) {
      return res
        .status(400)
        .json({ error: "Device ID and Channel ID are required" });
    }

    if (
      !storageOptions ||
      !Array.isArray(storageOptions) ||
      storageOptions.length === 0
    ) {
      return res.status(400).json({ error: "Storage options are required" });
    }

    if (
      !colorOptions ||
      !Array.isArray(colorOptions) ||
      colorOptions.length === 0
    ) {
      return res.status(400).json({ error: "Color options are required" });
    }

    if (!simOptions || !Array.isArray(simOptions) || simOptions.length === 0) {
      return res.status(400).json({ error: "SIM options are required" });
    }

    if (
      !isDamagedOptions ||
      !Array.isArray(isDamagedOptions) ||
      isDamagedOptions.length === 0
    ) {
      return res.status(400).json({ error: "Is damaged options are required" });
    }

    if (
      !isFunctionalOptions ||
      !Array.isArray(isFunctionalOptions) ||
      isFunctionalOptions.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Is functional options are required" });
    }

    if (
      !isRepairedOptions ||
      !Array.isArray(isRepairedOptions) ||
      isRepairedOptions.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Is repaired options are required" });
    }

    const deduction = new Deduction({
      deviceId,
      channelId,
      storageOptions,
      colorOptions,
      simOptions,
      isDamagedOptions,
      isFunctionalOptions,
      isRepairedOptions,
      cosmeticCondition,
      ptaApproved,
      factoryUnlocked,
      accessories,
      tradeInBonus,
    });

    await deduction.save();
    res.status(201).json(deduction);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add deduction", details: err.message });
  }
};

// Get deductions for a specific device and channel
const getDeductions = async (req, res) => {
  try {
    const { deviceId, channelId } = req.query;

    // Validate required query params
    if (!deviceId || !channelId) {
      return res
        .status(400)
        .json({ error: "Device ID and Channel ID are required" });
    }

    // Fetch deductions from the database
    const deductions = await Deduction.findOne({
      deviceId,
      channelId,
    }).populate("deviceId channelId");

    if (!deductions) {
      return res.status(404).json({
        error: "No deductions found for the specified device and channel",
      });
    }

    res.status(200).json(deductions);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch deductions", details: err.message });
  }
};

// Update a deduction
const updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Update the deduction document
    const deduction = await Deduction.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!deduction) {
      return res.status(404).json({ error: "Deduction not found" });
    }

    res.status(200).json(deduction);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update deduction", details: err.message });
  }
};

// Delete a deduction
const deleteDeduction = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the deduction document
    const deduction = await Deduction.findByIdAndDelete(id);
    if (!deduction) {
      return res.status(404).json({ error: "Deduction not found" });
    }

    res.status(200).json({ message: "Deduction deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete deduction", details: err.message });
  }
};

module.exports = {
  addDeduction,
  getDeductions,
  updateDeduction,
  deleteDeduction,
};
