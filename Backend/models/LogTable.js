const mongoose = require("mongoose");

// LogTable model — tracks system events (login attempts, errors, etc.)
const logTableSchema = new mongoose.Schema(
  {
    logLabel: {
      type: String,
      required: true,
      enum: ["Success", "Fail", "Warning", "Info"],
    },
    log: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "createdAt" },
  }
);

module.exports = mongoose.model("LogTable", logTableSchema);
