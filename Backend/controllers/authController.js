const User = require("../models/User");
const Role = require("../models/Role");
const LogTable = require("../models/LogTable");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Get the User role
    const userRole = await Role.findOne({ roleName: "User" });
    if (!userRole) {
      return res.status(500).json({ message: "User role not found. Please seed the database." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      roleID: userRole._id,
    });

    // Log the registration
    await LogTable.create({
      logLabel: "Success",
      log: `User ${user.email} registered successfully`,
      userID: user._id,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: userRole.roleName,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user and populate role
    const user = await User.findOne({ email }).populate("roleID");
    if (!user) {
      await LogTable.create({ logLabel: "Fail", log: `Failed login attempt for email: ${email}` });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await LogTable.create({ logLabel: "Fail", log: `Failed login attempt for user: ${user._id}`, userID: user._id });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log success
    await LogTable.create({
      logLabel: "Success",
      log: `User ${user.email} logged in successfully`,
      userID: user._id,
    });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.roleID.roleName,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash").populate("roleID");
    res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login, getMe };
