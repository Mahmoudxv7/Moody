const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────
app.use(cors());                        // Allow cross-origin requests from frontend
app.use(express.json());                // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ── ROUTES ──────────────────────────────────────
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/users",       require("./routes/userRoutes"));
app.use("/api/moods",       require("./routes/moodRoutes"));
app.use("/api/notes",       require("./routes/noteRoutes"));
app.use("/api/therapists",  require("./routes/therapistRoutes"));
app.use("/api/quotes",      require("./routes/quoteRoutes"));

// ── DEFAULT ROUTE ────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🌿 Moody API is running..." });
});

// ── 404 HANDLER ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── ERROR HANDLER ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ── START SERVER ─────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
