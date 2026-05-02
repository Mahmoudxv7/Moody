import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMoodEntry, getMoodEntries } from "../services/moodService";
import { getRandomQuote } from "../services/quoteService";
import { getCurrentUser, logout } from "../services/authService";

const moods = [
  { emoji: "😄", label: "VERY HAPPY", value: 5, key: "Very Happy" },
  { emoji: "😊", label: "HAPPY",      value: 4, key: "Happy"      },
  { emoji: "😌", label: "CALM",       value: 3, key: "Calm"       },
  { emoji: "😐", label: "NEUTRAL",    value: 2, key: "Neutral"    },
  { emoji: "😢", label: "SAD",        value: 1, key: "Sad"        },
  { emoji: "😰", label: "VERY SAD",   value: 0, key: "Very Sad"   },
];

const calendarDays = ["M","T","W","T","F","S","S"];
const calendarNums = [
  [28,29,30,31,1,2,3],
  [4,5,6,7,8,9,10],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [selectedMood, setSelectedMood] = useState(2);
  const [reflection, setReflection]     = useState("");
  const [saved, setSaved]               = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState("");
  const [entries, setEntries]           = useState([]);
  const [quote, setQuote]               = useState({ quoteText: "Your emotions are like waves, they come and go. You are the ocean, vast and enduring.", authorName: "Moody" });

  // Load mood entries and random quote on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesData, quoteData] = await Promise.all([
          getMoodEntries(),
          getRandomQuote(),
        ]);
        setEntries(entriesData);
        if (quoteData) setQuote(quoteData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (selectedMood === null) return;
    try {
      setSaving(true);
      setSaveError("");
      const moodData = {
        moodLabel: moods[selectedMood].key,
        moodScore: moods[selectedMood].value,
        reflection,
        entryDate: new Date(),
      };
      const newEntry = await createMoodEntry(moodData);
      setEntries([newEntry, ...entries]);
      setSaved(true);
      setReflection("");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Calculate stats from real entries
  const streak  = entries.length > 0 ? Math.min(entries.length, 12) : 0;
  const topMood = entries.length > 0
    ? Object.entries(
        entries.reduce((acc, e) => {
          acc[e.moodLabel] = (acc[e.moodLabel] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : "Calm";

  const recentEntries = entries.slice(0, 3);

  const moodTrend = entries.slice(0, 7).reverse().map((e, i) => ({
    day: ["MON","TUE","WED","THU","FRI","SAT","SUN"][i] || `D${i}`,
    height: (e.moodScore / 5) * 90 + 10,
    color: e.moodScore >= 4 ? "#7c5cbf" : e.moodScore >= 2 ? "#c4aef0" : "#e8e0f8",
  }));

  return (
    <div className="db-root">

      {/* ── NAVBAR ── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/" className="db-logo">Moody</Link>
          <div className="db-nav-links">
            <Link to="/dashboard"  className="db-nav-link db-nav-active">Dashboard</Link>
            <Link to="/calendar"   className="db-nav-link">Calendar</Link>
            <Link to="/report"     className="db-nav-link">Monthly Report</Link>
            <Link to="/profile"    className="db-nav-link">Profile</Link>
          </div>
          <div className="db-nav-right">
            <button className="db-icon-btn">🔔</button>
            <button className="db-icon-btn" onClick={handleLogout} title="Logout">↪</button>
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
            <p className="db-welcome-label">WELCOME BACK, {user?.fullName?.split(" ")[0]?.toUpperCase() || "USER"}</p>
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
                <button
                  className="db-save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Entry"}
                </button>
              </div>
              {saveError && <p style={{ color: "#e57373", fontSize: 12, marginTop: 6 }}>{saveError}</p>}
            </div>
          </div>

          {/* Mood Trend Chart */}
          <div className="db-trend-card">
            <div className="db-trend-header">
              <h3 className="db-trend-title">Mood Trend</h3>
              <span className="db-trend-label">LAST 7 DAYS</span>
            </div>
            <div className="db-trend-chart">
              {(moodTrend.length > 0 ? moodTrend : [
                { day:"MON", height:55, color:"#c4aef0" },
                { day:"TUE", height:40, color:"#c4aef0" },
                { day:"WED", height:70, color:"#c4aef0" },
                { day:"THU", height:90, color:"#7c5cbf" },
                { day:"FRI", height:50, color:"#c4aef0" },
                { day:"SAT", height:35, color:"#c4aef0" },
                { day:"SUN", height:25, color:"#c4aef0" },
              ]).map((bar, i) => (
                <div key={i} className="db-bar-col">
                  <div className="db-bar" style={{ height: `${bar.height}px`, background: bar.color }} />
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
            <p className="db-quote-text">"{quote.quoteText}"</p>
            <span className="db-quote-attr">— DAILY REFLECTION</span>
          </div>

          {/* Therapist */}
          <div className="db-therapist-card">
            <div className="db-therapist-left">
              <div className="db-therapist-avatar">👩‍⚕️</div>
              <div>
                <span className="db-therapist-label">YOUR THERAPIST</span>
                <p className="db-therapist-name">Dr. Elena Smith</p>
              </div>
            </div>
            <button className="db-therapist-msg-btn">💬</button>
          </div>

          {/* Mini Calendar */}
          <div className="db-calendar-card">
            <div className="db-calendar-header">
              <span className="db-calendar-month">November 2024</span>
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
                  <div key={`${wi}-${di}`} className={`db-cal-day ${num === 9 ? "db-cal-today" : ""} ${num < 4 && wi === 0 ? "db-cal-dim" : ""}`}>
                    <span>{num}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="db-stats-row">
            <div className="db-stat-card">
              <span className="db-stat-label">STREAK</span>
              <span className="db-stat-num">{streak} <span className="db-stat-unit">days</span></span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">ENTRIES</span>
              <span className="db-stat-num">{entries.length}</span>
            </div>
          </div>

          {/* Top Mood */}
          <div className="db-topmood-card">
            <div>
              <span className="db-stat-label">TOP MOOD</span>
              <p className="db-topmood-text">{topMood}</p>
            </div>
            <span className="db-topmood-emoji">😌</span>
          </div>

          {/* Recent Reflections */}
          <div className="db-reflections-card">
            <div className="db-reflections-header">
              <h3 className="db-reflections-title">Recent Reflections</h3>
              <Link to="/calendar" className="db-view-all">View All</Link>
            </div>
            {recentEntries.length > 0 ? (
              recentEntries.map((r, i) => (
                <div key={i} className="db-reflection-item">
                  <span className="db-ref-emoji">😌</span>
                  <div className="db-ref-content">
                    <span className="db-ref-time">{new Date(r.entryDate).toLocaleDateString()}</span>
                    <p className="db-ref-text">{r.reflection || r.moodLabel}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: "#c0b0d8", textAlign: "center", padding: "16px 0" }}>
                No reflections yet. Start logging your mood! 🌿
              </p>
            )}
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
        <p className="db-footer-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
      </footer>

    </div>
  );
}
