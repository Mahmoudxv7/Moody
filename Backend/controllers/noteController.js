const TherapistNote = require("../models/TherapistNote");
const TherapistAssignment = require("../models/TherapistAssignment");

// @desc    Create a new therapist note
// @route   POST /api/notes
// @access  Private (Therapist only)
const createNote = async (req, res) => {
  try {
    const { userID, noteText, tags } = req.body;

    // Find the assignment between therapist and user
    const assignment = await TherapistAssignment.findOne({
      therapistID: req.user._id,
      userID,
      status: "Active",
    });

    if (!assignment) {
      return res.status(403).json({ message: "No active assignment found for this user" });
    }

    const note = await TherapistNote.create({
      therapistID: req.user._id,
      userID,
      assignmentID: assignment._id,
      noteText,
      tags: tags || [],
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all notes by therapist
// @route   GET /api/notes
// @access  Private (Therapist only)
const getNotes = async (req, res) => {
  try {
    const notes = await TherapistNote.find({ therapistID: req.user._id })
      .populate("userID", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private (Therapist only)
const getNoteById = async (req, res) => {
  try {
    const note = await TherapistNote.findById(req.params.id).populate("userID", "fullName email");
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.therapistID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private (Therapist only)
const updateNote = async (req, res) => {
  try {
    const note = await TherapistNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.therapistID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { noteText, tags } = req.body;
    if (noteText) note.noteText = noteText;
    if (tags)     note.tags     = tags;
    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (Therapist only)
const deleteNote = async (req, res) => {
  try {
    const note = await TherapistNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.therapistID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
