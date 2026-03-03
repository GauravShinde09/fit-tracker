const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD

    meals: [
      {
        type: { type: String, required: true }, // Breakfast, Lunch, etc.
        food: { type: String, required: true },
        calories: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true, // ✅ VERY IMPORTANT (createdAt, updatedAt)
  }
);

// ✅ Optional but highly recommended (data consistency)
dietSchema.index({ user: 1, date: 1 }, { unique: true });

const Diet = mongoose.model("Diet", dietSchema);
module.exports = Diet;
