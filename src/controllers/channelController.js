const Channel = require("../models/Channel");
const { generateApiKey } = require("../utils");

// Add a new channel
const addChannel = async (req, res) => {
  try {
    const { name, password, permissions = [], quota = 1000 } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Channel name and password is required" });
    }

    const apiKey = generateApiKey(); // Generate a unique API key
    const channel = new Channel({ name, password, apiKey, permissions, quota });
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

module.exports = {
  addChannel,
  getChannels,
  getChannelById,
  updatePermissions,
  updateQuota,
  deleteChannel,
};
