import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    emoji: "🌸",
    bg: "#f3e8ff",
    date: "April 13th",
    text: '"Spent the day outside. Fresh air made everything feel better. Felt truly alive."',
  },
  {
    emoji: "⚡",
    bg: "#e8f4ff",
    date: "April 21st",
    text: '"One of the best days this month. Everything just clicked. Feeling capable and strong."',
  },
  {
    emoji: "☕",
    bg: "#fff0e8",
    date: "April 26th",
    text: '"Peaceful day. Journaled and reflected on the month. It is okay to slow down sometimes."',
  },
];

const distribution = [
  { label: "Happy & Very Happy", pct: 47, color: "#7c5cbf" },
  { label: "Calm",               pct: 27, color: "#c4aef0" },
  { label: "Neutral",            pct: 13, color: "#e8e0f8" },
  { label: "Sad",                pct: 13, color: "#e57373" },
];

// Animated donut
function Donut({ pct = 84, size = 130, stroke = 16 }) {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct / 100)), 200);
    return () => clearTimeout(t);
  }, [circ, pct]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0ebff" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke="#7c5cbf"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
    </svg>
  );
}

export default function MonthlyReport() {
  return (
    <div className="rep-root">

      {/* ── NAVBAR ── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/" className="db-logo">Moody</Link>
          <div className="db-nav-links">
            <Link to="/dashboard" className="db-nav-link">Dashboard</Link>
            <Link to="/calendar"  className="db-nav-link">History</Link>
            <Link to="/report"    className="db-nav-link db-nav-active">Reports</Link>
            <Link to="/profile"   className="db-nav-link">Profile</Link>
          </div>
          <div className="db-nav-right">
            <button className="db-icon-btn">🔔</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="rep-body">

        {/* Hero — NO Export button */}
        <div className="rep-hero">
          <div className="rep-hero-left">
            <h1 className="rep-title">Your Monthly Mood<br />Report</h1>
            <p className="rep-subtitle">
              A gentle look back at your emotional journey through April. Take a
              breath and see how far you've come.
            </p>
          </div>
        </div>

        {/* Monthly Essence + Mood Distribution */}
        <div className="rep-row-2">

          {/* Monthly Essence */}
          <div className="rep-essence-card">
            <h3 className="rep-card-title">Monthly Essence</h3>
            <div className="rep-essence-stats">
              <div className="rep-essence-stat">
                <span className="rep-essence-label">AVERAGE MOOD</span>
                <span className="rep-essence-val">Happy <span className="rep-val-icon">😊</span></span>
              </div>
              <div className="rep-essence-stat">
                <span className="rep-essence-label">LOGGED DAYS</span>
                <span className="rep-essence-val">30 <span className="rep-val-sub">/30</span></span>
              </div>
              <div className="rep-essence-stat">
                <span className="rep-essence-label">AVG SCORE</span>
                <span className="rep-essence-val">3.8</span>
              </div>
              <div className="rep-essence-stat">
                <span className="rep-essence-label">CONSISTENCY</span>
                <span className="rep-essence-val rep-val-high">High</span>
              </div>
            </div>

            <div className="rep-insight-box">
              <div className="rep-insight-header">
                <span className="rep-insight-icon">✦</span>
                <span className="rep-insight-title">Insight of the Month</span>
              </div>
              <p className="rep-insight-text">
                You logged all 30 days this month — a perfect streak! Your mood was mostly positive,
                with calm and happy days making up over 74% of the month.
              </p>
            </div>
          </div>

          {/* Mood Distribution — donut chart is working fine, kept */}
          <div className="rep-dist-card">
            <h3 className="rep-card-title">Mood Distribution</h3>
            <div className="rep-donut-wrap">
              <Donut pct={84} size={130} stroke={16} />
              <div className="rep-donut-center">
                <span className="rep-donut-pct">84%</span>
                <span className="rep-donut-sub">Positive</span>
              </div>
            </div>
            <div className="rep-dist-legend">
              {distribution.map((d, i) => (
                <div key={i} className="rep-legend-item">
                  <span className="rep-legend-dot" style={{ background: d.color }} />
                  <span className="rep-legend-label">{d.label}</span>
                  <span className="rep-legend-pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reflection Highlights */}
        <div className="rep-highlights-section">
          <h3 className="rep-highlights-title">Reflection Highlights</h3>
          <div className="rep-highlights-grid">
            {highlights.map((h, i) => (
              <div key={i} className="rep-highlight-card">
                <div className="rep-highlight-emoji-wrap" style={{ background: h.bg }}>
                  <span>{h.emoji}</span>
                </div>
                <span className="rep-highlight-date">{h.date}</span>
                <p className="rep-highlight-text">{h.text}</p>
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
