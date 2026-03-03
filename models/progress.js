const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("Progress", progressSchema);
