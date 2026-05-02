const MotivationQuote = require("../models/MotivationQuote");

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
const getQuotes = async (req, res) => {
  try {
    const quotes = await MotivationQuote.find();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a random quote
// @route   GET /api/quotes/random
// @access  Public
const getRandomQuote = async (req, res) => {
  try {
    const count  = await MotivationQuote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote  = await MotivationQuote.findOne().skip(random);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new quote
// @route   POST /api/quotes
// @access  Private
const createQuote = async (req, res) => {
  try {
    const { quoteText, authorName } = req.body;
    if (!quoteText || !authorName) {
      return res.status(400).json({ message: "Please provide quote text and author name" });
    }
    const quote = await MotivationQuote.create({ quoteText, authorName });
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getQuotes, getRandomQuote, createQuote };
