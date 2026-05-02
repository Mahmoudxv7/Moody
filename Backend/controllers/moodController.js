const MoodEntry = require("../models/MoodEntry");

// @desc    Create a new mood entry
// @route   POST /api/moods
// @access  Private
const createMoodEntry = async (req, res) => {
  try {
    const { moodLabel, moodScore, reflection, entryDate } = req.body;

    // Check if user already has an entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await MoodEntry.findOne({
      userID: req.user._id,
      entryDate: { $gte: today, $lt: tomorrow },
    });

    if (existingEntry) {
      return res.status(400).json({ message: "You have already logged your mood today" });
    }

    const moodEntry = await MoodEntry.create({
      userID: req.user._id,
      moodLabel,
      moodScore,
      reflection,
      entryDate: entryDate || Date.now(),
    });

    res.status(201).json(moodEntry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all mood entries for logged in user
// @route   GET /api/moods
// @access  Private
const getMoodEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userID: req.user._id })
      .sort({ entryDate: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single mood entry by ID
// @route   GET /api/moods/:id
// @access  Private
const getMoodEntryById = async (req, res) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Mood entry not found" });
    if (entry.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a mood entry (today only)
// @route   PUT /api/moods/:id
// @access  Private
const updateMoodEntry = async (req, res) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Mood entry not found" });
    if (entry.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { moodLabel, moodScore, reflection } = req.body;
    if (moodLabel)  entry.moodLabel  = moodLabel;
    if (moodScore !== undefined) entry.moodScore = moodScore;
    if (reflection !== undefined) entry.reflection = reflection;

    const updated = await entry.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a mood entry
// @route   DELETE /api/moods/:id
// @access  Private
const deleteMoodEntry = async (req, res) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Mood entry not found" });
    if (entry.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await entry.deleteOne();
    res.status(200).json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get monthly mood report
// @route   GET /api/moods/report
// @access  Private
const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year || new Date().getFullYear(), (month || new Date().getMonth() + 1) - 1, 1);
    const end   = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);

    const entries = await MoodEntry.find({
      userID: req.user._id,
      entryDate: { $gte: start, $lte: end },
    }).sort({ entryDate: 1 });

    // Calculate statistics
    const totalEntries = entries.length;
    const avgScore = totalEntries > 0
      ? (entries.reduce((sum, e) => sum + e.moodScore, 0) / totalEntries).toFixed(2)
      : 0;

    // Count mood labels
    const moodCounts = {};
    entries.forEach(e => {
      moodCounts[e.moodLabel] = (moodCounts[e.moodLabel] || 0) + 1;
    });

    res.status(200).json({
      month: start.toLocaleString("default", { month: "long" }),
      year: start.getFullYear(),
      totalEntries,
      avgScore,
      moodCounts,
      entries,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createMoodEntry, getMoodEntries, getMoodEntryById, updateMoodEntry, deleteMoodEntry, getMonthlyReport };
