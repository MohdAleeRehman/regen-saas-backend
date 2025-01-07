const Channel = require("../models/Channel");
const { generateApiKey } = require("../utils");
const TradeInSubmission = require("../models/TradeInSubmission");

// Add a new channel
const addChannel = async (req, res) => {
  try {
    const { name, password, permissions = [], quota = 1000, vendors = [] } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Channel name and password is required" });
    }

    const apiKey = generateApiKey(); // Generate a unique API key
    const channel = new Channel({ name, password, apiKey, permissions, quota, vendors });
    await channel.save();

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to add channel", details: err.message });
  }
};

// Get all channels
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch channels", details: err.message });
  }
};

// Get submissions as per channel
const getChannelSubmissions = async (req, res) => {
    try {
        const { channelId } = req.params;

        // Find the channel by ID
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Find all submissions associated with the channel's API key
        const submissions = await TradeInSubmission.find({ apiKey: channel.apiKey });
        res.status(200).json({ channel, submissions });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ message: "Failed to fetch submissions" });
    }
};

// Get a channel by ID
const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch channel", details: err.message });
  }
};

// Update channel permissions
const updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: "Permissions must be an array" });
    }

    const channel = await Channel.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update permissions", details: err.message });
  }
};

// Update channel quota
const updateQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { quota } = req.body;

    if (!quota || typeof quota !== "number") {
      return res.status(400).json({ error: "Quota must be a number" });
    }

    const channel = await Channel.findByIdAndUpdate(
      id,
      { quota },
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quota", details: err.message });
  }
};

// Delete a channel
const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findByIdAndDelete(id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete channel", details: err.message });
  }
};

const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, quota, vendors } = req.body;

    const updateData = {};
    if (permissions) updateData.permissions = permissions;
    if (quota) updateData.quota = quota;
    if (vendors) updateData.vendors = vendors;

    const channel = await Channel.findByIdAndUpdate(id, updateData, { new: true });
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update channel", details: err.message });
  }
};


module.exports = {
  addChannel,
  getChannels,
  getChannelById,
  updatePermissions,
  updateQuota,
  deleteChannel,
  getChannelSubmissions,
  updateChannel,
};
