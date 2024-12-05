const express = require('express');
const router = express.Router();
const { adminLogin, channelLoginStep1, channelLoginStep2 } = require('../controllers/authenticationController');

router.post('/admin/login', adminLogin);
router.post('/channel/login/step1', channelLoginStep1);
router.post('/channel/login/step2', channelLoginStep2);

module.exports = router;