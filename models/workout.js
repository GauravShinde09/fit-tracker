const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  sets: [
    {
      weight: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
    },
  ],

  duration: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  calories: {
    type: Number,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Workout", workoutSchema);
