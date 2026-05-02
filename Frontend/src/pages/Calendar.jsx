import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMoodEntries } from "../services/moodService";
import { getCurrentUser, logout } from "../services/authService";

const DAYS_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const moodEmojis = {
  "Very Happy": "😄",
  "Happy":      "😊",
  "Calm":       "😌",
  "Neutral":    "😐",
  "Sad":        "😢",
  "Very Sad":   "😰",
};

const calendarWeeks = [
  [null, null, null, 1,    2,    3,    4   ],
  [5,    6,    7,    8,    9,    10,   11  ],
  [12,   13,   14,   15,   16,   17,   18  ],
  [19,   20,   21,   22,   23,   24,   25  ],
  [26,   27,   28,   29,   30,   31,   null],
];

const monthSpark = [
  { h: 60 }, { h: 80 }, { h: 50 },
  { h: 90 }, { h: 40 }, { h: 70 },
];

export default function Calendar() {
  const navigate  = useNavigate();
  const user      = getCurrentUser();

  const [entries, setEntries]         = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode]       = useState("MONTH");
  const [loading, setLoading]         = useState(true);

  // Load mood entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getMoodEntries();
        setEntries(data);
      } catch (err) {
        console.error("Failed to load entries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Map entries by day of month
  const entryByDay = {};
  entries.forEach(e => {
    const day = new Date(e.entryDate).getDate();
    entryByDay[day] = e;
  });

  const selectedEntry = selectedDay ? entryByDay[selectedDay] : null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="cal-root">

      {/* ── NAVBAR ── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/" className="db-logo">Moody</Link>
          <div className="db-nav-links">
            <Link to="/dashboard" className="db-nav-link">Dashboard</Link>
            <Link to="/calendar"  className="db-nav-link db-nav-active">History</Link>
            <Link to="/report"    className="db-nav-link">Reports</Link>
            <Link to="/profile"   className="db-nav-link">Profile</Link>
          </div>
          <div className="db-nav-right">
            <button className="db-icon-btn">🔔</button>
            <button className="db-icon-btn" onClick={handleLogout} title="Logout">↪</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="cal-body">

        {/* ── LEFT ── */}
        <div className="cal-left">
          <div className="cal-header">
            <h1 className="cal-title">
              Emotional <em className="cal-title-em">Archive</em>
            </h1>
            <p className="cal-subtitle">
              Your digital cocoon preserves every heartbeat. Trace the patterns
              of your inner landscape through time.
            </p>
          </div>

          {/* Controls */}
          <div className="cal-controls">
            <div className="cal-month-nav">
              <button className="cal-nav-btn">‹</button>
              <span className="cal-month-label">October 2024</span>
              <button className="cal-nav-btn">›</button>
            </div>
            <div className="cal-view-toggle">
              {["MONTH", "WEEK"].map(v => (
                <button
                  key={v}
                  className={`cal-toggle-btn ${viewMode === v ? "cal-toggle-active" : ""}`}
                  onClick={() => setViewMode(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9b82cc" }}>
              🌿 Loading your emotional archive...
            </div>
          ) : (
            <div className="cal-grid-wrap">
              <div className="cal-day-labels">
                {DAYS_LABELS.map(d => (
                  <span key={d} className="cal-day-label">{d}</span>
                ))}
              </div>
              {calendarWeeks.map((week, wi) => (
                <div key={wi} className="cal-week-row">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="cal-cell cal-cell-empty" />;
                    const entry   = entryByDay[day];
                    const isToday = day === 9;
                    const isSel   = day === selectedDay;
                    return (
                      <div
                        key={di}
                        className={`cal-cell ${isSel ? "cal-cell-selected" : ""} ${isToday ? "cal-cell-today" : ""}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        <span className="cal-cell-num">{day}</span>
                        {entry && (
                          <span className="cal-cell-emoji">
                            {moodEmojis[entry.moodLabel] || "😌"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div className="cal-right">
          {selectedEntry ? (
            <>
              {/* Day detail card */}
              <div className="cal-detail-card">
                <div className="cal-detail-header">
                  <div>
                    <p className="cal-detail-date-label">
                      {new Date(selectedEntry.entryDate).toLocaleDateString("en-US", { weekday: "long", day: "2-digit" })}
                    </p>
                    <p className="cal-detail-month">
                      {new Date(selectedEntry.entryDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className="cal-locked-badge">LOCKED</span>
                </div>

                <div className="cal-detail-feeling">
                  <span className="cal-detail-section-label">⊙ FEELING</span>
                  <div className="cal-feeling-row">
                    <span className="cal-feeling-emoji">{moodEmojis[selectedEntry.moodLabel] || "😌"}</span>
                    <span className="cal-feeling-text">{selectedEntry.moodLabel}</span>
                  </div>
                </div>

                <div className="cal-divider" />

                <div className="cal-detail-reflection">
                  <span className="cal-detail-section-label">≡ REFLECTION</span>
                  <p className="cal-reflection-text">
                    {selectedEntry.reflection || "No reflection written for this day."}
                  </p>
                </div>

                <div className="cal-divider" />

                <div className="cal-times-row">
                  <div className="cal-time-item">
                    <span className="cal-time-label">CREATED</span>
                    <span className="cal-time-val">
                      {new Date(selectedEntry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="cal-time-item">
                    <span className="cal-time-label">UPDATED</span>
                    <span className="cal-time-val">
                      {new Date(selectedEntry.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <p className="cal-footer-note">
                  Reflecting on the past helps build a more mindful future.
                </p>
              </div>

              {/* Monthly Spark */}
              <div className="cal-spark-card">
                <h3 className="cal-spark-title">Monthly Spark</h3>
                <div className="cal-spark-bars">
                  {monthSpark.map((b, i) => (
                    <div key={i} className="cal-spark-bar"
                      style={{ height: `${b.h}%`, background: "#7c5cbf" }} />
                  ))}
                </div>
                <p className="cal-spark-note">
                  You have logged {entries.length} entries this period. Keep breathing.
                </p>
              </div>
            </>
          ) : (
            <div className="cal-no-entry">
              <span>📅</span>
              <p>Select a day to see your mood entry.</p>
              {entries.length === 0 && !loading && (
                <p style={{ fontSize: 12, marginTop: 8 }}>
                  No entries yet. Start logging from the{" "}
                  <Link to="/dashboard" style={{ color: "#7c5cbf" }}>Dashboard</Link>!
                </p>
              )}
            </div>
          )}
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
