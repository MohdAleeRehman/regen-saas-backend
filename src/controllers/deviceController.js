const Device = require("../models/Device");

// Add a new device
const addDevice = async (req, res) => {
  try {
    const { name, deviceType, vendor, basePrice } = req.body;

    if (!name || !deviceType || !vendor || !basePrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const device = new Device({ name, deviceType, vendor, basePrice });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: "Failed to add device", details: err.message });
  }
};

// Get all devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch devices", details: err.message });
  }
};

// Get a device by ID
const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch device", details: err.message });
  }
};

// Update a device
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const device = await Device.findByIdAndUpdate(id, updates, { new: true });
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: "Failed to update device", details: err.message });
  }
};

// Delete a device
const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json({ message: "Device deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete device", details: err.message });
  }
};

module.exports = {
  addDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
};
