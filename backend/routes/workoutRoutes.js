
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // 🔥 Added Bouncer

const {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

// 🔥 Locked down
router.get("/history", authMiddleware, getWorkouts);
router.post("/add", authMiddleware, addWorkout);
router.put("/:id", authMiddleware, updateWorkout);
router.delete("/:id", authMiddleware, deleteWorkout);

// ✅ Test route (Leaving this unlocked so you can test if the server is up)
router.get("/", (req, res) => {
  res.status(200).json({ message: "Workouts API is working!" });
});

module.exports = router;

