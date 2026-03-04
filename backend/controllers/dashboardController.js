
const Workout = require("../models/workout");
const Diet = require("../models/diet");

// GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    // 🔥 Extract ID securely from the backend token
    const userId = req.user.id; 

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // ===== DATE MATH: STRICT MONDAY TO SUNDAY =====
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD

    // Get the current day of the week (0 is Sunday, convert to 7 to keep Monday first)
    const dayOfWeek = now.getDay() || 7; 
    
    // Find this week's Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    const startOfWeek = monday.toISOString().split("T")[0];

    // Find this week's Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const endOfWeek = sunday.toISOString().split("T")[0];

    // ==========================
    // UNIQUE WORKOUT DAYS THIS WEEK
    // ==========================
    // 🔥 'distinct' returns an array of unique dates, so 2 workouts on Friday = 1 day.
    const uniqueWorkoutDates = await Workout.distinct("date", {
      user: userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });
    
    const workoutsThisWeek = uniqueWorkoutDates.length;

    // ==========================
    // CALORIES BURNED TODAY
    // ==========================
    const todayWorkouts = await Workout.find({
      user: userId, 
      date: today
    });

    const caloriesBurnedToday = todayWorkouts.reduce(
      (sum, workout) => sum + (workout.calories || 0),
      0
    );

    // ==========================
    // DIET TODAY
    // ==========================
    const diet = await Diet.findOne({ user: userId, date: today }); 

    let eatenCalories = 0;
    let targetCalories = 0;

    if (diet) {
      eatenCalories = diet.meals.reduce(
        (sum, meal) => sum + (meal.calories || 0),
        0
      );
      targetCalories = diet.targetCalories || 0;
    }

    // ==========================
    // FINAL RESPONSE
    // ==========================
    res.json({
      workoutsThisWeek, // Now correctly sends unique days for current Mon-Sun
      caloriesBurnedToday,
      diet: {
        eaten: eatenCalories,
        target: targetCalories
      }
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};