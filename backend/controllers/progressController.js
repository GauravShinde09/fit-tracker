
const Progress = require("../models/progress");

// GET all progress entries (Filtered for the logged-in user only)
const getProgress = async (req, res) => {
  try {
    // 🔥 Only finds entries belonging to the secure token ID
    const data = await Progress.find({ user: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};

// POST a new progress entry
const addProgress = async (req, res) => {
  const { date, weight, notes } = req.body;
  try {
    // 🔥 Attaches the logged-in user's ID to the new entry
    const newProgress = new Progress({ user: req.user.id, date, weight, notes });
    await newProgress.save();
    res.status(201).json({ message: "Progress added!" });
  } catch (err) {
    res.status(400).json({ message: "Error adding progress" });
  }
};

// PUT (Update) an existing progress entry
const updateProgress = async (req, res) => {
  const { id } = req.params;
  const { date, weight, notes } = req.body;

  try {
    // 🔥 Make sure the entry actually belongs to the user before updating
    const updated = await Progress.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { date, weight, notes },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    }
    res.json({ message: "Progress updated", updated });
  } catch (err) {
    res.status(400).json({ message: "Error updating progress" });
  }
};

// DELETE an existing progress entry
const deleteProgress = async (req, res) => {
  const { id } = req.params;

  try {
    // 🔥 Make sure the entry actually belongs to the user before deleting
    const deleted = await Progress.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    }
    res.json({ message: "Progress deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting progress" });
  }
};

module.exports = {
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,
};