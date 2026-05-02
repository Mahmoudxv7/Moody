const express = require("express");
const router = express.Router();
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require("../controllers/noteController");
const protect = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   POST /api/notes
// @desc    Create a new therapist note
// @access  Private (Therapist only)
router.post("/", createNote);

// @route   GET /api/notes
// @desc    Get all notes by therapist
// @access  Private (Therapist only)
router.get("/", getNotes);

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Private (Therapist only)
router.get("/:id", getNoteById);

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private (Therapist only)
router.put("/:id", updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private (Therapist only)
router.delete("/:id", deleteNote);

module.exports = router;
