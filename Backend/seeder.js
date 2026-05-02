const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const bcrypt = require("bcryptjs");

// Load env variables
dotenv.config();

// Force Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Import Models
const Role            = require("./models/Role");
const User            = require("./models/User");
const MoodEntry       = require("./models/MoodEntry");
const TherapistAssignment = require("./models/TherapistAssignment");
const TherapistNote   = require("./models/TherapistNote");
const MotivationQuote = require("./models/MotivationQuote");
const LogTable        = require("./models/LogTable");

// ── SEED DATA ──────────────────────────────────────────────

const roles = [
  { roleName: "User" },
  { roleName: "Therapist" },
];

const quotes = [
  { quoteText: "Self-awareness is not a destination, but a gentle daily practice of coming home to yourself.", authorName: "Margaret Van Selby" },
  { quoteText: "Your emotions are like waves, they come and go. You are the ocean, vast and enduring.", authorName: "Moody" },
  { quoteText: "Small progress is still progress.", authorName: "Yousif V. S." },
  { quoteText: "Your feelings matter every day.", authorName: "Ahmad Sam" },
  { quoteText: "Take one day at a time.", authorName: "Wael Nader" },
  { quoteText: "Healing is not linear, and that is okay.", authorName: "Moody" },
  { quoteText: "You are allowed to be both a masterpiece and a work in progress.", authorName: "Sophia Bush" },
];

// ── CONNECT & SEED ─────────────────────────────────────────
const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✅ MongoDB Connected for seeding...");

    // Clear existing data
    await Role.deleteMany();
    await User.deleteMany();
    await MoodEntry.deleteMany();
    await TherapistAssignment.deleteMany();
    await TherapistNote.deleteMany();
    await MotivationQuote.deleteMany();
    await LogTable.deleteMany();
    console.log("🗑️  Cleared existing data...");

    // Seed Roles
    const createdRoles = await Role.insertMany(roles);
    const userRole      = createdRoles.find(r => r.roleName === "User");
    const therapistRole = createdRoles.find(r => r.roleName === "Therapist");
    console.log("✅ Roles seeded...");

    // Seed Quotes
    await MotivationQuote.insertMany(quotes);
    console.log("✅ Motivation quotes seeded...");

    // Hash password helper
    const hashPassword = async (pw) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(pw, salt);
    };

    // Seed Users
    const users = await User.insertMany([
      {
        roleID: userRole._id,
        fullName: "Sarah Ahmed",
        email: "sarah@gmail.com",
        passwordHash: await hashPassword("Sarah123"),
      },
      {
        roleID: userRole._id,
        fullName: "Omar Ali",
        email: "omar@gmail.com",
        passwordHash: await hashPassword("Omar123"),
      },
      {
        roleID: therapistRole._id,
        fullName: "Dr. Lina Hassan",
        email: "lina@moody.com",
        passwordHash: await hashPassword("Lina123"),
      },
      {
        roleID: therapistRole._id,
        fullName: "Dr. Ahmad Salem",
        email: "ahmad@moody.com",
        passwordHash: await hashPassword("Ahmad123"),
      },
    ]);
    console.log("✅ Users seeded...");

    const sarah  = users.find(u => u.email === "sarah@gmail.com");
    const omar   = users.find(u => u.email === "omar@gmail.com");
    const lina   = users.find(u => u.email === "lina@moody.com");
    const ahmad  = users.find(u => u.email === "ahmad@moody.com");

    // Seed Therapist Assignments
    const assignments = await TherapistAssignment.insertMany([
      { userID: sarah._id, therapistID: lina._id,  status: "Active" },
      { userID: omar._id,  therapistID: ahmad._id, status: "Active" },
    ]);
    console.log("✅ Therapist assignments seeded...");

    // Seed Mood Entries
    await MoodEntry.insertMany([
      {
        userID: sarah._id,
        entryDate: new Date("2026-03-26"),
        moodLabel: "Happy",
        moodScore: 5,
        reflection: "I felt productive and relaxed today.",
      },
      {
        userID: sarah._id,
        entryDate: new Date("2026-03-27"),
        moodLabel: "Calm",
        moodScore: 4,
        reflection: "It was a quiet and balanced day.",
      },
      {
        userID: omar._id,
        entryDate: new Date("2026-03-27"),
        moodLabel: "Sad",
        moodScore: 2,
        reflection: "I felt stressed because of my assignments.",
      },
      {
        userID: omar._id,
        entryDate: new Date("2026-03-28"),
        moodLabel: "Neutral",
        moodScore: 3,
        reflection: "My day was okay overall.",
      },
    ]);
    console.log("✅ Mood entries seeded...");

    // Seed Therapist Notes
    await TherapistNote.insertMany([
      {
        therapistID: lina._id,
        userID: sarah._id,
        assignmentID: assignments[0]._id,
        noteText: "User has shown stable positive mood this week.",
        tags: ["PROGRESS", "STABLE"],
      },
      {
        therapistID: ahmad._id,
        userID: omar._id,
        assignmentID: assignments[1]._id,
        noteText: "User reflections mention academic stress repeatedly.",
        tags: ["ANXIETY", "FOLLOW-UP"],
      },
    ]);
    console.log("✅ Therapist notes seeded...");

    // Seed Log entries
    await LogTable.insertMany([
      { logLabel: "Success", log: "User sarah@gmail.com registered successfully", userID: sarah._id },
      { logLabel: "Success", log: "User omar@gmail.com registered successfully",  userID: omar._id  },
    ]);
    console.log("✅ Log entries seeded...");

    console.log("\n🌿 Database seeded successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("   👤 User:      sarah@gmail.com  / Sarah123");
    console.log("   👤 User:      omar@gmail.com   / Omar123");
    console.log("   🩺 Therapist: lina@moody.com   / Lina123");
    console.log("   🩺 Therapist: ahmad@moody.com  / Ahmad123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
