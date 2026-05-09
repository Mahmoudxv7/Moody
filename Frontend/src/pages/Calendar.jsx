import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMoodEntries } from "../services/moodService";

const DAYS_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const moodEmojis = {
  "Very Happy": "😄",
  "Happy":      "😊",
  "Calm":       "😌",
  "Neutral":    "😐",
  "Sad":        "😔",
  "Very Sad":   "😰",
};

// Hardcoded April 2026 demo data — shown when no real entries exist for that month
const aprilFallback = {
  1:  { emoji:"😊", feeling:"Happy",      reflection:'"Started the month with good energy. Had a productive morning and felt motivated."',      created:"08:30 AM", updated:"09:00 PM", locked:true },
  2:  { emoji:"😄", feeling:"Very Happy", reflection:'"Great day with friends. Laughed a lot and felt really connected."',                       created:"09:00 AM", updated:"10:00 PM", locked:true },
  3:  { emoji:"😌", feeling:"Calm",       reflection:'"A quiet peaceful day. Read a book and enjoyed the silence."',                              created:"08:00 AM", updated:"08:30 PM", locked:true },
  4:  { emoji:"😊", feeling:"Happy",      reflection:'"Good progress on my project today. Feeling accomplished."',                                created:"09:15 AM", updated:"09:45 PM", locked:true },
  5:  { emoji:"😔", feeling:"Sad",        reflection:'"Feeling a little down today. Missing home and feeling tired."',                            created:"10:00 AM", updated:"11:00 PM", locked:true },
  6:  { emoji:"😌", feeling:"Calm",       reflection:'"Slow morning but recovered well. Evening walk helped a lot."',                             created:"08:45 AM", updated:"09:15 PM", locked:true },
  7:  { emoji:"😄", feeling:"Very Happy", reflection:'"Finished a big assignment. Feeling free and relieved."',                                   created:"09:00 AM", updated:"10:30 PM", locked:true },
  8:  { emoji:"😊", feeling:"Happy",      reflection:'"Had a great conversation with my therapist. Feeling understood."',                         created:"08:00 AM", updated:"09:00 PM", locked:true },
  9:  { emoji:"😐", feeling:"Neutral",    reflection:'"Normal day. Nothing special but nothing bad either."',                                     created:"09:30 AM", updated:"10:00 PM", locked:true },
  10: { emoji:"😌", feeling:"Calm",       reflection:'"Focused and relaxed. Got a lot of work done quietly."',                                    created:"08:15 AM", updated:"08:45 PM", locked:true },
  11: { emoji:"😔", feeling:"Sad",        reflection:'"Rough day. Felt overwhelmed with everything at once."',                                    created:"10:30 AM", updated:"11:30 PM", locked:true },
  12: { emoji:"😊", feeling:"Happy",      reflection:'"Better than yesterday. Small wins matter a lot."',                                         created:"09:00 AM", updated:"09:30 PM", locked:true },
  13: { emoji:"😄", feeling:"Very Happy", reflection:'"Spent the day outside. Fresh air made everything feel better."',                           created:"08:30 AM", updated:"10:00 PM", locked:true },
  14: { emoji:"😌", feeling:"Calm",       reflection:'"A gentle day. Listened to music and cooked at home."',                                     created:"09:00 AM", updated:"09:30 PM", locked:true },
  15: { emoji:"😐", feeling:"Neutral",    reflection:'"Midway through the month. Feeling okay, nothing more."',                                   created:"09:45 AM", updated:"10:15 PM", locked:true },
  16: { emoji:"😊", feeling:"Happy",      reflection:'"Good study session today. Feeling on track."',                                             created:"08:00 AM", updated:"09:00 PM", locked:true },
  17: { emoji:"😄", feeling:"Very Happy", reflection:'"Celebrated a small achievement with family. So grateful."',                               created:"09:15 AM", updated:"10:45 PM", locked:true },
  18: { emoji:"😔", feeling:"Sad",        reflection:'"Tired and a bit anxious. Need more rest this week."',                                      created:"10:00 AM", updated:"11:00 PM", locked:true },
  19: { emoji:"😌", feeling:"Calm",       reflection:'"Rested well. Felt centered and at peace with myself."',                                    created:"08:30 AM", updated:"09:00 PM", locked:true },
  20: { emoji:"😊", feeling:"Happy",      reflection:'"Productive morning. Things are moving in the right direction."',                           created:"08:00 AM", updated:"09:30 PM", locked:true },
  21: { emoji:"😄", feeling:"Very Happy", reflection:'"One of the best days this month. Everything just clicked."',                               created:"09:00 AM", updated:"10:00 PM", locked:true },
  22: { emoji:"😌", feeling:"Calm",       reflection:'"Quiet evening with tea. Grateful for simple moments."',                                    created:"08:45 AM", updated:"09:15 PM", locked:true },
  23: { emoji:"😐", feeling:"Neutral",    reflection:'"Average day. Nothing to complain about really."',                                          created:"09:30 AM", updated:"10:00 PM", locked:true },
  24: { emoji:"😊", feeling:"Happy",      reflection:'"Connected with an old friend today. It was really nice."',                                 created:"08:15 AM", updated:"09:45 PM", locked:true },
  25: { emoji:"😄", feeling:"Very Happy", reflection:'"Feeling grateful and positive about the future ahead."',                                   created:"09:00 AM", updated:"10:30 PM", locked:true },
  26: { emoji:"😌", feeling:"Calm",       reflection:'"Peaceful day. Journaled and reflected on the month so far."',                              created:"08:30 AM", updated:"09:00 PM", locked:true },
  27: { emoji:"😔", feeling:"Sad",        reflection:'"End of week tiredness. Need to recharge this weekend."',                                   created:"10:00 AM", updated:"10:30 PM", locked:true },
  28: { emoji:"😊", feeling:"Happy",      reflection:'"Weekend! Rested well and feeling recharged and ready."',                                   created:"09:00 AM", updated:"10:00 PM", locked:true },
  29: { emoji:"😄", feeling:"Very Happy", reflection:'"Great end to the month. Proud of how far I have come."',                                   created:"08:30 AM", updated:"09:30 PM", locked:true },
  30: { emoji:"😌", feeling:"Calm",       reflection:'"Last day of April. Feeling calm and ready for May."',                                      created:"09:00 AM", updated:"09:30 PM", locked:true },
};

// Build calendar weeks for any month/year
function buildCalendarWeeks(year, month) {
  const firstDay    = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad    = firstDay === 0 ? 6 : firstDay - 1; // Mon-start

  const days = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7).concat(Array(7).fill(null)).slice(0, 7));
  }
  return weeks;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function Calendar() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const [moodMap,      setMoodMap]      = useState({}); // { day: { emoji, entry } }
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [loading,      setLoading]      = useState(true);

  const calendarWeeks = buildCalendarWeeks(viewYear, viewMonth);

  // ── Load moods from backend whenever month/year changes ──
  useEffect(() => {
    loadMoods();
  }, [viewYear, viewMonth]);

  const loadMoods = async () => {
    setLoading(true);
    try {
      const data = await getMoodEntries();

      // Build a map: day number → mood entry (for current viewMonth/viewYear)
      const map = {};
      data.forEach(entry => {
        const d = new Date(entry.entryDate);
        if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
          const day = d.getDate();
          map[day] = {
            emoji:      moodEmojis[entry.moodLabel] || "😊",
            feeling:    entry.moodLabel,
            reflection: entry.reflection || "",
            created:    new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            updated:    new Date(entry.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            locked:     true,
            entryId:    entry._id,
          };
        }
      });

      // If viewing April 2026 and no real entries → use hardcoded demo data
      const isApril2026 = viewYear === 2026 && viewMonth === 3;
      const finalMap = (isApril2026 && Object.keys(map).length === 0)
        ? aprilFallback
        : map;

      setMoodMap(finalMap);

      // Auto-select today if it has an entry
      const todayDay = now.getDate();
      if (viewYear === now.getFullYear() && viewMonth === now.getMonth() && finalMap[todayDay]) {
        setSelectedDay(todayDay);
      } else {
        setSelectedDay(null);
      }
    } catch (err) {
      console.error("Failed to load moods:", err);
      // On error — if April 2026, still show demo data
      if (viewYear === 2026 && viewMonth === 3) setMoodMap(aprilFallback);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const entry       = selectedDay ? moodMap[selectedDay] : null;
  const totalLogged = Object.keys(moodMap).length;

  // Monthly spark bars based on real data
  const sparkBars = (() => {
    const entries = Object.values(moodMap);
    if (entries.length === 0) return Array(8).fill({ h: 30, c: "#e0d8f0" });
    return Array(8).fill(null).map((_, i) => {
      const e = entries[i];
      if (!e) return { h: 20, c: "#e0d8f0" };
      const score = ["Very Sad","Sad","Neutral","Calm","Happy","Very Happy"].indexOf(e.feeling);
      return {
        h: Math.max(15, ((score + 1) / 6) * 100),
        c: score >= 3 ? "#7c5cbf" : score === 2 ? "#f5c842" : "#e57373",
      };
    });
  })();

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
              Your mood history for every day this month.
            </p>
          </div>

          {/* Month nav — MONTH button only, no WEEK */}
          <div className="cal-controls">
            <div className="cal-month-nav">
              <button className="cal-nav-btn" onClick={goToPrevMonth}>‹</button>
              <span className="cal-month-label">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button className="cal-nav-btn" onClick={goToNextMonth}>›</button>
            </div>
            <div className="cal-view-toggle">
              <button className="cal-toggle-btn cal-toggle-active">MONTH</button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="cal-grid-wrap">
            <div className="cal-day-labels">
              {DAYS_LABELS.map(d => (
                <span key={d} className="cal-day-label">{d}</span>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#9b82cc", fontSize: "14px" }}>
                Loading your moods...
              </div>
            ) : (
              calendarWeeks.map((week, wi) => (
                <div key={wi} className="cal-week-row">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="cal-cell cal-cell-empty" />;
                    const mood  = moodMap[day];
                    const isSel = day === selectedDay;
                    const isToday = day === now.getDate() &&
                                    viewMonth === now.getMonth() &&
                                    viewYear  === now.getFullYear();
                    return (
                      <div
                        key={di}
                        className={`cal-cell ${isSel ? "cal-cell-selected" : ""} ${isToday && !isSel ? "cal-cell-today" : ""}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        <span className="cal-cell-num">{day}</span>
                        {mood && <span className="cal-cell-emoji">{mood.emoji}</span>}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="cal-right">
          {entry ? (
            <>
              {/* Day Detail */}
              <div className="cal-detail-card">
                <div className="cal-detail-header">
                  <div>
                    <p className="cal-detail-date-label">Day {selectedDay}</p>
                    <p className="cal-detail-month">{MONTH_NAMES[viewMonth]} {viewYear}</p>
                  </div>
                  {entry.locked && <span className="cal-locked-badge">LOCKED</span>}
                </div>

                <div className="cal-detail-feeling">
                  <span className="cal-detail-section-label">⊙ FEELING</span>
                  <div className="cal-feeling-row">
                    <span className="cal-feeling-emoji">{entry.emoji}</span>
                    <span className="cal-feeling-text">{entry.feeling}</span>
                  </div>
                </div>

                <div className="cal-divider" />

                <div className="cal-detail-reflection">
                  <span className="cal-detail-section-label">≡ REFLECTION</span>
                  <p className="cal-reflection-text">
                    {entry.reflection
                      ? `"${entry.reflection}"`
                      : <span style={{ color: "#c0b0d8", fontStyle: "normal" }}>No reflection written.</span>
                    }
                  </p>
                </div>

                <div className="cal-divider" />

                <div className="cal-times-row">
                  <div className="cal-time-item">
                    <span className="cal-time-label">CREATED</span>
                    <span className="cal-time-val">{entry.created}</span>
                  </div>
                  <div className="cal-time-item">
                    <span className="cal-time-label">UPDATED</span>
                    <span className="cal-time-val">{entry.updated}</span>
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
                  {sparkBars.map((b, i) => (
                    <div key={i} className="cal-spark-bar"
                      style={{ height: `${b.h}%`, background: b.c }} />
                  ))}
                </div>
                <p className="cal-spark-note">
                  {totalLogged} {totalLogged === 1 ? "day" : "days"} logged this month. Keep going! 🌿
                </p>
              </div>
            </>
          ) : (
            <div className="cal-no-entry">
              <span>📅</span>
              <p>
                {selectedDay && !loading
                  ? "No mood logged for this day."
                  : "Click on any day to see your mood entry."
                }
              </p>
              {selectedDay && !loading && !entry && (
                <Link to="/dashboard" style={{
                  marginTop: "12px",
                  display: "inline-block",
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #7c5cbf, #5b3fa0)",
                  color: "#fff",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}>
                  Log Today's Mood →
                </Link>
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
        <p className="db-footer-copy">© 2026 MOODY.</p>
      </footer>

    </div>
  );
}
