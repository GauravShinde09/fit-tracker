const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // 🔥 Added Bouncer

const {
  getDashboardSummary
} = require("../controllers/dashboardController");

// 🔥 Locked down
router.get("/summary", authMiddleware, getDashboardSummary);

module.exports = router;