import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMoodEntry, getMoodEntries } from "../services/moodService";
import { getCurrentUser } from "../services/authService";

const moods = [
  { emoji: "😄", label: "VERY HAPPY", value: 5, moodLabel: "Very Happy" },
  { emoji: "😊", label: "HAPPY",      value: 4, moodLabel: "Happy"      },
  { emoji: "😌", label: "CALM",       value: 3, moodLabel: "Calm"       },
  { emoji: "😐", label: "NEUTRAL",    value: 2, moodLabel: "Neutral"    },
  { emoji: "😢", label: "SAD",        value: 1, moodLabel: "Sad"        },
  { emoji: "😰", label: "VERY SAD",   value: 0, moodLabel: "Very Sad"   },
];

const calendarDays = ["M","T","W","T","F","S","S"];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState(1); // default Happy
  const [reflection, setReflection]     = useState("");
  const [saved, setSaved]               = useState(false);
  const [saveError, setSaveError]       = useState("");
  const [saving, setSaving]             = useState(false);
  const [recentMoods, setRecentMoods]   = useState([]);
  const [stats, setStats]               = useState({ streak: 0, entries: 0, topMood: "—", topEmoji: "😊" });
  const [calendarNums, setCalendarNums] = useState([]);
  const [moodDots, setMoodDots]         = useState({});
  const navigate = useNavigate();
  const user = getCurrentUser();

  // ── Load moods from backend on mount ──
  useEffect(() => {
    loadMoods();
    buildCalendar();
  }, []);

  const loadMoods = async () => {
    try {
      const data = await getMoodEntries();
      setRecentMoods(data.slice(0, 3));

      // Build stats
      const moodCounts = {};
      data.forEach(m => {
        moodCounts[m.moodLabel] = (moodCounts[m.moodLabel] || 0) + 1;
      });
      const topMoodLabel = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      const topEmoji = moods.find(m => m.moodLabel === topMoodLabel)?.emoji || "😊";

      // Calculate streak
      const today = new Date();
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const found = data.find(m => m.entryDate?.split("T")[0] === dateStr);
        if (found) streak++;
        else break;
      }

      setStats({ streak, entries: data.length, topMood: topMoodLabel, topEmoji });

      // Build mood dots for mini calendar
      const dots = {};
      data.forEach(m => {
        const day = new Date(m.entryDate).getDate();
        const score = m.moodScore;
        dots[day] = score >= 3 ? 3 : score === 2 ? 2 : 1;
      });
      setMoodDots(dots);
    } catch (err) {
      console.error("Failed to load moods:", err);
    }
  };

  const buildCalendar = () => {
    const today = new Date();
    const year  = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convert Sunday=0 to Mon-start
    const startPad = (firstDay === 0 ? 6 : firstDay - 1);
    const allDays  = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    // Split into rows of 7
    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7).concat(Array(7).fill(null)).slice(0, 7));
    }
    setCalendarNums(weeks.slice(0, 2)); // show first 2 weeks in mini calendar
  };

  const handleSave = async () => {
    if (saving) return;
    setSaveError("");
    setSaving(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      await createMoodEntry({
        moodLabel:  moods[selectedMood].moodLabel,
        moodScore:  moods[selectedMood].value,
        reflection: reflection.trim(),
        entryDate:  today,
      });

      setSaved(true);
      setReflection("");
      setTimeout(() => setSaved(false), 2500);
      loadMoods(); // refresh stats and calendar dots
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already")) {
        setSaveError("You already logged your mood today. Come back tomorrow! 😊");
      } else {
        setSaveError("Could not save. Please check your connection.");
      }
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().getDate();
  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const userName  = user?.fullName?.split(" ")[0] || "Sarah";

  // Mood trend bars from last 7 entries
  const trendBars = (() => {
    const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
    if (recentMoods.length === 0) {
      return days.map(d => ({ day: d, height: 40, color: "#c4aef0" }));
    }
    return recentMoods.slice(0, 7).map((m, i) => ({
      day: days[i] || days[0],
      height: Math.max(20, (m.moodScore / 5) * 100),
      color: m.moodScore >= 3 ? "#7c5cbf" : "#e57373",
    }));
  })();

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
            <button className="db-icon-btn" onClick={() => navigate("/")}>↪</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="db-body">

        {/* ── LEFT ── */}
        <div className="db-left">

          <div className="db-welcome">
            <p className="db-welcome-label">WELCOME BACK, {userName.toUpperCase()}</p>
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
                  onClick={() => { setSelectedMood(i); setSaveError(""); }}
                >
                  <span className="db-mood-emoji">{m.emoji}</span>
                  <span className="db-mood-label">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="db-reflection-section">
              <label className="db-reflection-label">REFLECTION</label>
              <textarea
                className="db-reflection-textarea"
                placeholder="What's weighing on your mind or lifting your spirits?"
                value={reflection}
                onChange={e => { setReflection(e.target.value); setSaveError(""); }}
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
              {saveError && (
                <p style={{ fontSize: "13px", color: "#e57373", marginTop: "6px" }}>
                  ⚠ {saveError}
                </p>
              )}
            </div>
          </div>

          {/* Mood Trend */}
          <div className="db-trend-card">
            <div className="db-trend-header">
              <h3 className="db-trend-title">Mood Trend</h3>
              <span className="db-trend-label">LAST 7 DAYS</span>
            </div>
            <div className="db-trend-chart">
              {trendBars.map((bar, i) => (
                <div key={i} className="db-bar-col">
                  <div className="db-bar" style={{ height: `${bar.height}px`, background: bar.color }} />
                  <span className="db-bar-day">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="db-right">

          {/* Quote */}
          <div className="db-quote-card">
            <p className="db-quote-text">
              "Your emotions are like waves, they come and go. You are the ocean, vast and enduring."
            </p>
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
          </div>

          {/* Mini Calendar */}
          <div className="db-calendar-card">
            <div className="db-calendar-header">
              <span className="db-calendar-month">{monthName}</span>
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
                    className={`db-cal-day ${num === today ? "db-cal-today" : ""} ${!num ? "db-cal-dim" : ""}`}
                  >
                    <span>{num || ""}</span>
                    {num && moodDots[num] && (
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

          {/* Stats */}
          <div className="db-stats-row">
            <div className="db-stat-card">
              <span className="db-stat-label">STREAK</span>
              <span className="db-stat-num">{stats.streak} <span className="db-stat-unit">days</span></span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">ENTRIES</span>
              <span className="db-stat-num">{stats.entries}</span>
            </div>
          </div>

          {/* Top Mood */}
          <div className="db-topmood-card">
            <div>
              <span className="db-stat-label">TOP MOOD</span>
              <p className="db-topmood-text">{stats.topMood}</p>
            </div>
            <span className="db-topmood-emoji">{stats.topEmoji}</span>
          </div>

          {/* Recent Reflections */}
          <div className="db-reflections-card">
            <div className="db-reflections-header">
              <h3 className="db-reflections-title">Recent Reflections</h3>
              <Link to="/calendar" className="db-view-all">View All</Link>
            </div>
            {recentMoods.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#c0b0d8", padding: "10px 0" }}>
                No entries yet. Log your first mood above! 😊
              </p>
            ) : (
              recentMoods.map((m, i) => {
                const emoji = moods.find(x => x.moodLabel === m.moodLabel)?.emoji || "😊";
                const date  = new Date(m.entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={i} className="db-reflection-item">
                    <span className="db-ref-emoji">{emoji}</span>
                    <div className="db-ref-content">
                      <span className="db-ref-time">{date}</span>
                      <p className="db-ref-text">
                        {m.reflection ? m.reflection.slice(0, 45) + "..." : `Feeling ${m.moodLabel}`}
                      </p>
                    </div>
                  </div>
                );
              })
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
        <p className="db-footer-copy">© 2026 MOODY.</p>
      </footer>

    </div>
  );
}
