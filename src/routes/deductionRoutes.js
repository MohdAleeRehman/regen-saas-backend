const express = require("express");
const {
  addDeduction,
  getDeductions,
  updateDeduction,
  deleteDeduction,
} = require("../controllers/deductionController");

const router = express.Router();

// Deduction Routes
router.post("/deductions", addDeduction);           // Add a new deduction configuration
router.get("/deductions", getDeductions);           // Get deductions for a specific device and channel
router.put("/deductions/:id", updateDeduction);     // Update a specific deduction by ID
router.delete("/deductions/:id", deleteDeduction);  // Delete a specific deduction by ID

module.exports = router;
