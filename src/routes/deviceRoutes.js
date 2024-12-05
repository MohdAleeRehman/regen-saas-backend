const express = require("express");
const {
  addDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");

const router = express.Router();

// Device Routes
router.post("/devices", addDevice);            // Add a new device
router.get("/devices", getDevices);           // Get all devices
router.get("/devices/:id", getDeviceById);    // Get a specific device by ID
router.put("/devices/:id", updateDevice);     // Update a specific device by ID
router.delete("/devices/:id", deleteDevice);  // Delete a specific device by ID

module.exports = router;
