import { useState } from "react";
import { Link } from "react-router-dom";

const DAYS_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// April 2026 starts on Wednesday → 2 nulls at start
const calendarWeeks = [
  [null, null, 1,  2,  3,  4,  5 ],
  [6,    7,    8,  9,  10, 11, 12],
  [13,   14,   15, 16, 17, 18, 19],
  [20,   21,   22, 23, 24, 25, 26],
  [27,   28,   29, 30, null, null, null],
];

// Every single day of April 2026 has a mood
const moodMap = {
  1:  { emoji: "😊", color: "#7c5cbf" },
  2:  { emoji: "😄", color: "#7c5cbf" },
  3:  { emoji: "😌", color: "#7c5cbf" },
  4:  { emoji: "😊", color: "#7c5cbf" },
  5:  { emoji: "😔", color: "#e57373" },
  6:  { emoji: "😌", color: "#7c5cbf" },
  7:  { emoji: "😄", color: "#7c5cbf" },
  8:  { emoji: "😊", color: "#7c5cbf" },
  9:  { emoji: "😐", color: "#f5c842" },
  10: { emoji: "😌", color: "#7c5cbf" },
  11: { emoji: "😔", color: "#e57373" },
  12: { emoji: "😊", color: "#7c5cbf" },
  13: { emoji: "😄", color: "#7c5cbf" },
  14: { emoji: "😌", color: "#7c5cbf" },
  15: { emoji: "😐", color: "#f5c842" },
  16: { emoji: "😊", color: "#7c5cbf" },
  17: { emoji: "😄", color: "#7c5cbf" },
  18: { emoji: "😔", color: "#e57373" },
  19: { emoji: "😌", color: "#7c5cbf" },
  20: { emoji: "😊", color: "#7c5cbf" },
  21: { emoji: "😄", color: "#7c5cbf" },
  22: { emoji: "😌", color: "#7c5cbf" },
  23: { emoji: "😐", color: "#f5c842" },
  24: { emoji: "😊", color: "#7c5cbf" },
  25: { emoji: "😄", color: "#7c5cbf" },
  26: { emoji: "😌", color: "#7c5cbf" },
  27: { emoji: "😔", color: "#e57373" },
  28: { emoji: "😊", color: "#7c5cbf" },
  29: { emoji: "😄", color: "#7c5cbf" },
  30: { emoji: "😌", color: "#7c5cbf" },
};

// Reflection details for every day
const entryDetails = {
  1:  { feeling: "Happy",      emoji: "😊", reflection: '"Started the month with good energy. Had a productive morning and felt motivated."', created: "08:30 AM", updated: "09:00 PM", locked: true  },
  2:  { feeling: "Very Happy", emoji: "😄", reflection: '"Great day with friends. Laughed a lot and felt really connected."', created: "09:00 AM", updated: "10:00 PM", locked: true  },
  3:  { feeling: "Calm",       emoji: "😌", reflection: '"A quiet peaceful day. Read a book and enjoyed the silence."', created: "08:00 AM", updated: "08:30 PM", locked: true  },
  4:  { feeling: "Happy",      emoji: "😊", reflection: '"Good progress on my project today. Feeling accomplished."', created: "09:15 AM", updated: "09:45 PM", locked: true  },
  5:  { feeling: "Sad",        emoji: "😔", reflection: '"Feeling a little down today. Missing home and feeling tired."', created: "10:00 AM", updated: "11:00 PM", locked: true  },
  6:  { feeling: "Calm",       emoji: "😌", reflection: '"Slow morning but recovered well. Evening walk helped a lot."', created: "08:45 AM", updated: "09:15 PM", locked: true  },
  7:  { feeling: "Very Happy", emoji: "😄", reflection: '"Finished a big assignment. Feeling free and relieved."', created: "09:00 AM", updated: "10:30 PM", locked: true  },
  8:  { feeling: "Happy",      emoji: "😊", reflection: '"Had a great conversation with my therapist. Feeling understood."', created: "08:00 AM", updated: "09:00 PM", locked: true  },
  9:  { feeling: "Neutral",    emoji: "😐", reflection: '"Normal day. Nothing special but nothing bad either."', created: "09:30 AM", updated: "10:00 PM", locked: true  },
  10: { feeling: "Calm",       emoji: "😌", reflection: '"Focused and relaxed. Got a lot of work done quietly."', created: "08:15 AM", updated: "08:45 PM", locked: true  },
  11: { feeling: "Sad",        emoji: "😔", reflection: '"Rough day. Felt overwhelmed with everything at once."', created: "10:30 AM", updated: "11:30 PM", locked: true  },
  12: { feeling: "Happy",      emoji: "😊", reflection: '"Better than yesterday. Small wins matter a lot."', created: "09:00 AM", updated: "09:30 PM", locked: true  },
  13: { feeling: "Very Happy", emoji: "😄", reflection: '"Spent the day outside. Fresh air made everything feel better."', created: "08:30 AM", updated: "10:00 PM", locked: true  },
  14: { feeling: "Calm",       emoji: "😌", reflection: '"A gentle day. Listened to music and cooked at home."', created: "09:00 AM", updated: "09:30 PM", locked: true  },
  15: { feeling: "Neutral",    emoji: "😐", reflection: '"Midway through the month. Feeling okay, nothing more."', created: "09:45 AM", updated: "10:15 PM", locked: true  },
  16: { feeling: "Happy",      emoji: "😊", reflection: '"Good study session today. Feeling on track."', created: "08:00 AM", updated: "09:00 PM", locked: true  },
  17: { feeling: "Very Happy", emoji: "😄", reflection: '"Celebrated a small achievement with family. So grateful."', created: "09:15 AM", updated: "10:45 PM", locked: true  },
  18: { feeling: "Sad",        emoji: "😔", reflection: '"Tired and a bit anxious. Need more rest this week."', created: "10:00 AM", updated: "11:00 PM", locked: true  },
  19: { feeling: "Calm",       emoji: "😌", reflection: '"Rested well. Felt centered and at peace with myself."', created: "08:30 AM", updated: "09:00 PM", locked: true  },
  20: { feeling: "Happy",      emoji: "😊", reflection: '"Productive morning. Things are moving in the right direction."', created: "08:00 AM", updated: "09:30 PM", locked: true  },
  21: { feeling: "Very Happy", emoji: "😄", reflection: '"One of the best days this month. Everything just clicked."', created: "09:00 AM", updated: "10:00 PM", locked: true  },
  22: { feeling: "Calm",       emoji: "😌", reflection: '"Quiet evening with tea. Grateful for simple moments."', created: "08:45 AM", updated: "09:15 PM", locked: true  },
  23: { feeling: "Neutral",    emoji: "😐", reflection: '"Average day. Nothing to complain about really."', created: "09:30 AM", updated: "10:00 PM", locked: true  },
  24: { feeling: "Happy",      emoji: "😊", reflection: '"Connected with an old friend today. It was really nice."', created: "08:15 AM", updated: "09:45 PM", locked: true  },
  25: { feeling: "Very Happy", emoji: "😄", reflection: '"Feeling grateful and positive about the future ahead."', created: "09:00 AM", updated: "10:30 PM", locked: true  },
  26: { feeling: "Calm",       emoji: "😌", reflection: '"Peaceful day. Journaled and reflected on the month so far."', created: "08:30 AM", updated: "09:00 PM", locked: false },
  27: { feeling: "Sad",        emoji: "😔", reflection: '"End of week tiredness. Need to recharge this weekend."', created: "10:00 AM", updated: "10:30 PM", locked: false },
  28: { feeling: "Happy",      emoji: "😊", reflection: '"Weekend! Rested well and feeling recharged and ready."', created: "09:00 AM", updated: "10:00 PM", locked: false },
  29: { feeling: "Very Happy", emoji: "😄", reflection: '"Great end to the month. Proud of how far I have come."', created: "08:30 AM", updated: "09:30 PM", locked: false },
  30: { feeling: "Calm",       emoji: "😌", reflection: '"Last day of April. Feeling calm and ready for May."', created: "09:00 AM", updated: "09:30 PM", locked: false },
};

const monthSpark = [
  { h: 70, c: "#7c5cbf" },
  { h: 85, c: "#7c5cbf" },
  { h: 45, c: "#e57373" },
  { h: 90, c: "#5b3fa0" },
  { h: 60, c: "#c4aef0" },
  { h: 75, c: "#7c5cbf" },
  { h: 55, c: "#7c5cbf" },
  { h: 80, c: "#7c5cbf" },
];

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(26);
  const [viewMode, setViewMode]       = useState("MONTH");

  const entry = entryDetails[selectedDay] || null;

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

          <div className="cal-controls">
            <div className="cal-month-nav">
              <button className="cal-nav-btn">‹</button>
              <span className="cal-month-label">April 2026</span>
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

          {/* Calendar Grid */}
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
                  const mood  = moodMap[day];
                  const isSel = day === selectedDay;
                  return (
                    <div
                      key={di}
                      className={`cal-cell ${isSel ? "cal-cell-selected" : ""}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <span className="cal-cell-num">{day}</span>
                      {mood && <span className="cal-cell-emoji">{mood.emoji}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="cal-right">
          {entry ? (
            <>
              <div className="cal-detail-card">
                <div className="cal-detail-header">
                  <div>
                    <p className="cal-detail-date-label">Day {selectedDay}</p>
                    <p className="cal-detail-month">April 2026</p>
                  </div>
                  {entry.locked && (
                    <span className="cal-locked-badge">LOCKED</span>
                  )}
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
                  <p className="cal-reflection-text">{entry.reflection}</p>
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

              <div className="cal-spark-card">
                <h3 className="cal-spark-title">Monthly Spark</h3>
                <div className="cal-spark-bars">
                  {monthSpark.map((b, i) => (
                    <div
                      key={i}
                      className="cal-spark-bar"
                      style={{ height: `${b.h}%`, background: b.c }}
                    />
                  ))}
                </div>
                <p className="cal-spark-note">
                  84% positive mood this month. Keep going! 🌿
                </p>
              </div>
            </>
          ) : (
            <div className="cal-no-entry">
              <span>📅</span>
              <p>Select a day to see your mood entry.</p>
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
