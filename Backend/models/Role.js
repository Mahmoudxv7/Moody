const mongoose = require("mongoose");

// Role model — defines user types (User or Therapist)
const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    enum: ["User", "Therapist"],
  },
});

module.exports = mongoose.model("Role", roleSchema);
