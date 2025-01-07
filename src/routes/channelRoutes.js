const express = require("express");
const {
  addChannel,
  getChannels,
  getChannelById,
  deleteChannel,
  updatePermissions,
  updateQuota,
  getChannelSubmissions,
  updateChannel,
} = require("../controllers/channelController");

const router = express.Router();

// Channel Routes
router.post("/channels", addChannel);           // Add a new channel
router.get("/channels", getChannels);           // Get all channels
router.get("/channels/:id", getChannelById);    // Get a specific channel by ID
router.put("/channels/:id", updateChannel); // Update channel data
router.put("/channels/:id/permissions", updatePermissions);  // Update channel permissions
router.put("/channels/:id/quota", updateQuota);  // Update channel quota
router.delete("/channels/:id", deleteChannel);  // Delete a specific channel by ID

module.exports = router;
