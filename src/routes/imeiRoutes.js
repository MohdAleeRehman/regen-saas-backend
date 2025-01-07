const express = require("express");
const { checkIMEI } = require("../controllers/imeiController");

const router = express.Router();

// Route to check IMEI
router.post("/check-imei", checkIMEI);

module.exports = router;
