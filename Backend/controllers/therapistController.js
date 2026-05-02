const User = require("../models/User");
const Role = require("../models/Role");
const TherapistAssignment = require("../models/TherapistAssignment");

// @desc    Get all therapists
// @route   GET /api/therapists
// @access  Private
const getTherapists = async (req, res) => {
  try {
    const therapistRole = await Role.findOne({ roleName: "Therapist" });
    const therapists = await User.find({ roleID: therapistRole._id }).select("-passwordHash");
    res.status(200).json(therapists);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Assign a therapist to a user
// @route   POST /api/therapists/assign
// @access  Private
const assignTherapist = async (req, res) => {
  try {
    const { therapistID } = req.body;

    // Check if already assigned
    const existing = await TherapistAssignment.findOne({
      userID: req.user._id,
      status: "Active",
    });

    if (existing) {
      // Update existing assignment
      existing.therapistID = therapistID;
      existing.assignedDate = Date.now();
      await existing.save();
      return res.status(200).json(existing);
    }

    // Create new assignment
    const assignment = await TherapistAssignment.create({
      userID: req.user._id,
      therapistID,
      status: "Active",
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users assigned to the logged in therapist
// @route   GET /api/therapists/patients
// @access  Private (Therapist only)
const getAssignedUsers = async (req, res) => {
  try {
    const assignments = await TherapistAssignment.find({
      therapistID: req.user._id,
      status: "Active",
    }).populate("userID", "-passwordHash");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get assignment for a specific user
// @route   GET /api/therapists/assignment/:userId
// @access  Private
const getAssignment = async (req, res) => {
  try {
    const assignment = await TherapistAssignment.findOne({
      userID: req.params.userId,
      status: "Active",
    })
      .populate("therapistID", "-passwordHash")
      .populate("userID", "-passwordHash");

    if (!assignment) {
      return res.status(404).json({ message: "No active assignment found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTherapists, assignTherapist, getAssignedUsers, getAssignment };
