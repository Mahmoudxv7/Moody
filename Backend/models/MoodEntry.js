const mongoose = require("mongoose");

// MoodEntry model — stores daily mood logs for each user
const moodEntrySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    moodLabel: {
      type: String,
      required: [true, "Mood label is required"],
      enum: ["Very Happy", "Happy", "Calm", "Neutral", "Sad", "Very Sad"],
    },
    moodScore: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    reflection: {
      type: String,
      trim: true,
      maxlength: [500, "Reflection cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one mood entry per day
moodEntrySchema.index({ userID: 1, entryDate: 1 }, { unique: true });

module.exports = mongoose.model("MoodEntry", moodEntrySchema);
