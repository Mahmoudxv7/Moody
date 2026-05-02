const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private
router.get("/:id", getUserById);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete("/:id", deleteUser);

module.exports = router;
