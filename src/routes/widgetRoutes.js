const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const { getChannelDevices, getDeductionsForDevice } = require('../controllers/widgetController');

// Get device for the channel
router.get('/channel-devices', apiKeyAuth, getChannelDevices);

// Get deductions for a device
router.get('/device-deductions/:deviceId', apiKeyAuth, getDeductionsForDevice);

module.exports = router;