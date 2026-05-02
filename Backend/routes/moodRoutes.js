const express = require("express");
const router = express.Router();
const { createMoodEntry, getMoodEntries, getMoodEntryById, updateMoodEntry, deleteMoodEntry, getMonthlyReport } = require("../controllers/moodController");
const protect = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   POST /api/moods
// @desc    Create a new mood entry
// @access  Private
router.post("/", createMoodEntry);

// @route   GET /api/moods
// @desc    Get all mood entries for logged in user
// @access  Private
router.get("/", getMoodEntries);

// @route   GET /api/moods/report
// @desc    Get monthly mood report for logged in user
// @access  Private
router.get("/report", getMonthlyReport);

// @route   GET /api/moods/:id
// @desc    Get single mood entry by ID
// @access  Private
router.get("/:id", getMoodEntryById);

// @route   PUT /api/moods/:id
// @desc    Update a mood entry
// @access  Private
router.put("/:id", updateMoodEntry);

// @route   DELETE /api/moods/:id
// @desc    Delete a mood entry
// @access  Private
router.delete("/:id", deleteMoodEntry);

module.exports = router;
