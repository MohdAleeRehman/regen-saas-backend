const TradeInSubmission = require("../models/TradeInSubmission");
const Channel = require("../models/Channel");

const submitTradeIn = async (req, res) => {
  try {
    const { device, basePrice, tradeInValue, tradeInBonus, finalTradeInValue,  options, apiKey, discountCode } = req.body;

    const channel = await Channel.findOne({ apiKey });
    if (!channel) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    const existingSubmission = await TradeInSubmission.findOne({
      device,
      apiKey,
      discountCode,
    });

    if (existingSubmission) {
      return res.status(201).json({ message: "Data already stored", stored: true });
    }

    const newSubmission = new TradeInSubmission({
      device,
      basePrice,
      tradeInValue,
      tradeInBonus,
      finalTradeInValue,
      options,
      channelName: channel.name,
      apiKey,
      discountCode,
    });

    await newSubmission.save();

    channel.quotaUsed += 1;
    await channel.save();

    res.status(201).json({ message: "Trade-in submitted successfully", success: true });
  } catch (err) {
    console.error("Error submitting trade-in:", err);
    res.status(500).json({ message: "Trade-in submission failed" });
  }
};

// Fetch all trade-in submissions (for Super Admin)
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TradeInSubmission.find();
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching trade-in submissions:", err);
    res.status(500).json({ message: "Failed to fetch trade-in submissions" });
  }
};

// Fetch trade-in submissions for a specific channel
const getChannelSubmissions = async (req, res) => {
  try {
    const { channelId } = req.params;

    // Validate channel existence
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Fetch submissions for the channel
    const submissions = await TradeInSubmission.find({ channelName: channel.name });

    res.status(200).json({ submissions });
  } catch (err) {
    console.error("Error fetching channel submissions:", err);
    res.status(500).json({ message: "Failed to fetch channel submissions" });
  }
};

// Update a specific trade-in submission (optional, for admin use)
const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSubmission = await TradeInSubmission.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({ message: "Submission updated successfully", updatedSubmission });
  } catch (err) {
    console.error("Error updating trade-in submission:", err);
    res.status(500).json({ message: "Failed to update submission" });
  }
};

// Delete a specific trade-in submission
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubmission = await TradeInSubmission.findByIdAndDelete(id);
    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update channel quota (optional, revert count)
    const channel = await Channel.findOne({ name: deletedSubmission.channelName });
    if (channel) {
      channel.quotaUsed = Math.max(0, channel.quotaUsed - 1);
      await channel.save();
    }

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting trade-in submission:", err);
    res.status(500).json({ message: "Failed to delete submission" });
  }
};

module.exports = {
  submitTradeIn,
  getAllSubmissions,
  getChannelSubmissions,
  updateSubmission,
  deleteSubmission,
};
