const mongoose = require("mongoose");

// TherapistNote model — private notes written by therapists about their patients
const therapistNoteSchema = new mongoose.Schema(
  {
    therapistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TherapistAssignment",
      required: true,
    },
    noteText: {
      type: String,
      required: [true, "Note text is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("TherapistNote", therapistNoteSchema);
