
const Workout = require("../models/workout");

// ✅ Get Workout History
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 Securely extract ID from token
    const { date } = req.query;

    // 🔥 Always filter by the logged-in user first
    let query = { user: userId };

    if (date) query.date = date;

    const history = await Workout.find(query).sort({ _id: -1 });

    res.json({ history });
  } catch (error) {
    console.error("❌ Error fetching workouts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Workout
const addWorkout = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 Securely extract ID from token
    const { name, sets, duration, type, calories, date, notes } = req.body;

    // 🔥 Notice: 'user' is removed from this check since we get it from the token now
    if (!name || !sets || !duration || !type || !calories || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(sets) || sets.length === 0) {
      return res
        .status(400)
        .json({ message: "Sets must be a non-empty array" });
    }

    const formattedSets = sets.map((set) => ({
      weight: Number(set.weight),
      reps: Number(set.reps),
    }));

    const workout = new Workout({
      user: userId, // 🔥 Attach the secure ID directly to the database entry
      name,
      sets: formattedSets,
      duration: Number(duration),
      type,
      calories: Number(calories),
      date,
      notes: notes || "",
    });

    await workout.save();

    res.status(201).json({
      message: "Workout saved successfully",
      workout,
    });
  } catch (error) {
    console.error("❌ Error adding workout:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ UPDATE WORKOUT
const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 🔥 Securely extract ID from token

    // 🔥 Find the workout ONLY if it belongs to this specific user
    const existingWorkout = await Workout.findOne({ _id: id, user: userId });

    if (!existingWorkout) {
      return res.status(404).json({ message: "Workout not found or unauthorized" });
    }

    // Only update fields that are provided
    const updatedData = {
      name: req.body.name ?? existingWorkout.name,
      duration: req.body.duration ?? existingWorkout.duration,
      type: req.body.type ?? existingWorkout.type,
      calories: req.body.calories ?? existingWorkout.calories,
      notes: req.body.notes ?? existingWorkout.notes,
    };

    if (Array.isArray(req.body.sets) && req.body.sets.length > 0) {
      updatedData.sets = req.body.sets.map((set) => ({
        weight: Number(set.weight),
        reps: Number(set.reps),
      }));
    } else {
      updatedData.sets = existingWorkout.sets;
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error("❌ Error updating workout:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete Workout
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 🔥 Securely extract ID from token

    // 🔥 Find and delete ONLY if it belongs to this specific user
    const deletedWorkout = await Workout.findOneAndDelete({ _id: id, user: userId });

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found or unauthorized" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting workout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  updateWorkout,
};

