const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const { getChannelDevices, getDeductionsForDevice } = require('../controllers/widgetController');

// Test route for middleware
router.get('/test-auth', apiKeyAuth, (req, res) => {
    console.log(`[DEBUG] Authenticated channel: ${req.channel.name}`);
    res.status(200).json({ message: "API Key Authenticated", channel: req.channel });
});

// Get device for the channel
router.get('/channel-devices', apiKeyAuth, getChannelDevices);

// Get deductions for a device
router.get('/device-deductions/:deviceId', apiKeyAuth, getDeductionsForDevice);

module.exports = router;
