const mongoose = require("mongoose");

// MotivationQuote model — stores motivational quotes shown on login
const motivationQuoteSchema = new mongoose.Schema({
  quoteText: {
    type: String,
    required: [true, "Quote text is required"],
    trim: true,
  },
  authorName: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
  },
});

module.exports = mongoose.model("MotivationQuote", motivationQuoteSchema);
