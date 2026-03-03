const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // 🔥 Added Bouncer

const {
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");

// 🔥 All doors are now locked with authMiddleware
router.get("/", authMiddleware, getProgress);
router.post("/add", authMiddleware, addProgress);
router.put("/update/:id", authMiddleware, updateProgress);
router.delete("/delete/:id", authMiddleware, deleteProgress);

module.exports = router;