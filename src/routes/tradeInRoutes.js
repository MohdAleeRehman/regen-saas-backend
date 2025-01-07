const express = require("express");
const {
  submitTradeIn,
  getAllSubmissions,
  getChannelSubmissions,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/tradeInController");

const router = express.Router();

// Trade-in submission routes
router.post("/trade-in-submit", submitTradeIn);
router.get("/submissions", getAllSubmissions);
router.get("/channel-submissions/:channelId", getChannelSubmissions);
router.put("/submissions/:id", updateSubmission); // Optional
router.delete("/submissions/:id", deleteSubmission);

module.exports = router;
