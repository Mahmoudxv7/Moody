import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const moods = [
  { emoji: "😄", label: "VERY HAPPY", value: 5 },
  { emoji: "😊", label: "HAPPY",      value: 4 },
  { emoji: "😌", label: "CALM",       value: 3 },
  { emoji: "😐", label: "NEUTRAL",    value: 2 },
  { emoji: "😢", label: "SAD",        value: 1 },
  { emoji: "😰", label: "VERY SAD",   value: 0 },
];

const moodTrend = [
  { day: "MON", height: 55, color: "#c4aef0" },
  { day: "TUE", height: 40, color: "#c4aef0" },
  { day: "WED", height: 70, color: "#c4aef0" },
  { day: "THU", height: 90, color: "#7c5cbf" },
  { day: "FRI", height: 50, color: "#c4aef0" },
  { day: "SAT", height: 35, color: "#c4aef0" },
  { day: "SUN", height: 25, color: "#c4aef0" },
];

const recentReflections = [
  { emoji: "😌", time: "Today, 9:30 AM",      text: "Feeling energetic in the park. The cris..." },
  { emoji: "😊", time: "Yesterday, 10:15 PM", text: "Meditation helped. I feel much more c..." },
  { emoji: "😢", time: "Apr 7, 2:45 PM",      text: "A bit overwhelmed. Trying to focus on or..." },
];

const calendarDays = ["M","T","W","T","F","S","S"];
const calendarNums = [
  [30, 31, 1,  2,  3,  4,  5],
  [6,  7,  8,  9,  10, 11, 12],
];
const moodDots = { 1:3, 2:2, 4:3, 5:2, 6:3, 7:1, 8:3 };

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState(2);
  const [reflection, setReflection]     = useState("");
  const [saved, setSaved]               = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    if (selectedMood === null) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setReflection("");
  };

  return (
    <div className="db-root">

      {/* ── NAVBAR ── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/" className="db-logo">Moody</Link>
          <div className="db-nav-links">
            <Link to="/dashboard" className="db-nav-link db-nav-active">Dashboard</Link>
            <Link to="/calendar"  className="db-nav-link">Calendar</Link>
            <Link to="/report"    className="db-nav-link">Monthly Report</Link>
            <Link to="/profile"   className="db-nav-link">Profile</Link>
          </div>
          <div className="db-nav-right">
            <button className="db-icon-btn">🔔</button>
            <button className="db-icon-btn" onClick={() => navigate("/")}>↪</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="db-body">

        {/* ── LEFT COLUMN ── */}
        <div className="db-left">

          {/* Welcome */}
          <div className="db-welcome">
            <p className="db-welcome-label">WELCOME BACK, SARAH</p>
            <h1 className="db-welcome-title">
              How does your<br />
              <em className="db-welcome-em">inner world</em> look today?
            </h1>
          </div>

          {/* Mood Selector */}
          <div className="db-mood-card">
            <h3 className="db-mood-title">How are you feeling today?</h3>
            <p className="db-mood-sub">Take a moment to check in with yourself.</p>
            <div className="db-mood-row">
              {moods.map((m, i) => (
                <button
                  key={i}
                  className={`db-mood-btn ${selectedMood === i ? "db-mood-btn-active" : ""}`}
                  onClick={() => setSelectedMood(i)}
                >
                  <span className="db-mood-emoji">{m.emoji}</span>
                  <span className="db-mood-label">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Reflection */}
            <div className="db-reflection-section">
              <label className="db-reflection-label">REFLECTION</label>
              <textarea
                className="db-reflection-textarea"
                placeholder="What's weighing on your mind or lifting your spirits?"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                maxLength={500}
              />
              <div className="db-reflection-footer">
                <span className="db-char-count">{reflection.length} / 500 CHARACTERS</span>
                <button className="db-save-btn" onClick={handleSave}>
                  {saved ? "✓ Saved!" : "Save Entry"}
                </button>
              </div>
            </div>
          </div>

          {/* Mood Trend Chart */}
          <div className="db-trend-card">
            <div className="db-trend-header">
              <h3 className="db-trend-title">Mood Trend</h3>
              <span className="db-trend-label">LAST 7 DAYS</span>
            </div>
            <div className="db-trend-chart">
              {moodTrend.map((bar, i) => (
                <div key={i} className="db-bar-col">
                  <div
                    className="db-bar"
                    style={{ height: `${bar.height}px`, background: bar.color }}
                  />
                  <span className="db-bar-day">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="db-right">

          {/* Daily Quote */}
          <div className="db-quote-card">
            <p className="db-quote-text">
              "Your emotions are like waves, they come and go. You are the ocean, vast and enduring."
            </p>
            <span className="db-quote-attr">— DAILY REFLECTION</span>
          </div>

          {/* Therapist card — NO message button */}
          <div className="db-therapist-card">
            <div className="db-therapist-left">
              <div className="db-therapist-avatar">👩‍⚕️</div>
              <div>
                <span className="db-therapist-label">YOUR THERAPIST</span>
                <p className="db-therapist-name">Dr. Elena Smith</p>
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="db-calendar-card">
            <div className="db-calendar-header">
              <span className="db-calendar-month">April 2026</span>
              <div className="db-calendar-nav">
                <button className="db-cal-nav-btn">‹</button>
                <button className="db-cal-nav-btn">›</button>
              </div>
            </div>
            <div className="db-calendar-grid">
              {calendarDays.map((d, i) => (
                <span key={i} className="db-cal-day-label">{d}</span>
              ))}
              {calendarNums.map((week, wi) =>
                week.map((num, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`db-cal-day ${num === 9 ? "db-cal-today" : ""} ${(num === 30 || num === 31) && wi === 0 ? "db-cal-dim" : ""}`}
                  >
                    <span>{num}</span>
                    {moodDots[num] && (
                      <span className="db-cal-dot" style={{
                        background: moodDots[num] === 3 ? "#7c5cbf" :
                                    moodDots[num] === 2 ? "#f5c842" : "#e57373"
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="db-stats-row">
            <div className="db-stat-card">
              <span className="db-stat-label">STREAK</span>
              <span className="db-stat-num">30 <span className="db-stat-unit">days</span></span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">ENTRIES</span>
              <span className="db-stat-num">30</span>
            </div>
          </div>

          {/* Top Mood */}
          <div className="db-topmood-card">
            <div>
              <span className="db-stat-label">TOP MOOD</span>
              <p className="db-topmood-text">Calm</p>
            </div>
            <span className="db-topmood-emoji">😌</span>
          </div>

          {/* Recent Reflections */}
          <div className="db-reflections-card">
            <div className="db-reflections-header">
              <h3 className="db-reflections-title">Recent Reflections</h3>
              <Link to="/calendar" className="db-view-all">View All</Link>
            </div>
            {recentReflections.map((r, i) => (
              <div key={i} className="db-reflection-item">
                <span className="db-ref-emoji">{r.emoji}</span>
                <div className="db-ref-content">
                  <span className="db-ref-time">{r.time}</span>
                  <p className="db-ref-text">{r.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="db-footer">
        <div className="db-footer-links">
          <a href="#" className="db-footer-link">PRIVACY POLICY</a>
          <a href="#" className="db-footer-link">TERMS OF SERVICE</a>
          <a href="#" className="db-footer-link">SUPPORT</a>
          <a href="#" className="db-footer-link">CONTACT</a>
        </div>
        <p className="db-footer-copy">© 2026 MOODY.</p>
      </footer>

    </div>
  );
}
