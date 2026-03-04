
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // 🔥 Added Bouncer
const Diet = require("../models/diet");

// ✅ GET DIET BY USER + DATE
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 Securely extracted from Token!
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const diet = await Diet.findOne({ user: userId, date });

    res.status(200).json({
      meals: diet ? diet.meals : [],
    });
  } catch (err) {
    console.error("❌ Fetch diet error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD / UPDATE DIET
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 Securely extracted from Token!
    const { date, meals } = req.body;

    if (!date || !Array.isArray(meals)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let diet = await Diet.findOne({ user: userId, date });

    if (diet) {
      diet.meals = meals;
    } else {
      diet = new Diet({ user: userId, date, meals });
    }

    await diet.save();

    res.status(200).json({
      message: "Diet saved",
      diet,
    });
  } catch (err) {
    console.error("❌ Save diet error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



