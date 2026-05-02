const express = require("express");
const router = express.Router();
const { getQuotes, getRandomQuote, createQuote } = require("../controllers/quoteController");
const protect = require("../middleware/authMiddleware");

// @route   GET /api/quotes
// @desc    Get all motivational quotes
// @access  Public
router.get("/", getQuotes);

// @route   GET /api/quotes/random
// @desc    Get a random motivational quote (shown on login)
// @access  Public
router.get("/random", getRandomQuote);

// @route   POST /api/quotes
// @desc    Create a new quote (admin only)
// @access  Private
router.post("/", protect, createQuote);

module.exports = router;
