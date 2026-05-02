const express = require("express");
const router = express.Router();
const { getTherapists, assignTherapist, getAssignedUsers, getAssignment } = require("../controllers/therapistController");
const protect = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   GET /api/therapists
// @desc    Get all available therapists
// @access  Private
router.get("/", getTherapists);

// @route   POST /api/therapists/assign
// @desc    Assign a therapist to a user
// @access  Private
router.post("/assign", assignTherapist);

// @route   GET /api/therapists/patients
// @desc    Get all users assigned to the logged in therapist
// @access  Private (Therapist only)
router.get("/patients", getAssignedUsers);

// @route   GET /api/therapists/assignment/:userId
// @desc    Get therapist assignment for a specific user
// @access  Private
router.get("/assignment/:userId", getAssignment);

module.exports = router;
