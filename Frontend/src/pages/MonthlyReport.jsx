import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMonthlyReport } from "../services/moodService";
import { getCurrentUser, logout } from "../services/authService";

const moodColors = {
  "Very Happy": "#7c5cbf",
  "Happy":      "#9b7de0",
  "Calm":       "#c4aef0",
  "Neutral":    "#e8e0f8",
  "Sad":        "#e57373",
  "Very Sad":   "#ef5350",
};

function Donut({ pct = 0, size = 130, stroke = 16 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct / 100)), 200);
    return () => clearTimeout(t);
  }, [circ, pct]);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0ebff" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c5cbf" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }} />
    </svg>
  );
}

// Build SVG trendline from entries
function buildPath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i-1], curr = pts[i];
    const cpx  = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function MonthlyReport() {
  const navigate = useNavigate();
  const user     = getCurrentUser();

  const now   = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getMonthlyReport(month, year);
        setReport(data);
      } catch (err) {
        console.error("Failed to load report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [month, year]);

  const handleLogout = () => { logout(); navigate("/"); };

  // Build trendline points from entries
  const svgW = 600, svgH = 100;
  const trendPoints = report?.entries?.map((e, i) => ({
    x: (i / Math.max(report.entries.length - 1, 1)) * svgW,
    y: svgH - (e.moodScore / 5) * svgH * 0.8 - 10,
  })) || [];

  const linePath = buildPath(trendPoints);
  const areaPath = trendPoints.length
    ? `${linePath} L ${trendPoints[trendPoints.length-1].x} ${svgH} L 0 ${svgH} Z`
    : "";

  // Calculate distribution
  const total      = report?.totalEntries || 0;
  const moodCounts = report?.moodCounts   || {};
  const positivePct = total > 0
    ? Math.round(((moodCounts["Very Happy"] || 0) + (moodCounts["Happy"] || 0) + (moodCounts["Calm"] || 0)) / total * 100)
    : 0;

  const distribution = Object.entries(moodCounts).map(([label, count]) => ({
    label,
    pct: Math.round((count / total) * 100),
    color: moodColors[label] || "#c4aef0",
  }));

  // Recent highlights from entries
  const highlights = (report?.entries || [])
    .filter(e => e.reflection)
    .slice(-3)
    .reverse()
    .map(e => ({
      emoji: "🌸",
      bg: "#f3e8ff",
      date: new Date(e.entryDate).toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      text: `"${e.reflection}"`,
    }));

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
            <button className="db-icon-btn" onClick={handleLogout} title="Logout">↪</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="rep-body">

        {/* Hero header */}
        <div className="rep-hero">
          <div className="rep-hero-left">
            <h1 className="rep-title">Your Monthly Mood<br />Report</h1>
            <p className="rep-subtitle">
              A gentle look back at your emotional journey through {report?.month || "this month"}.
              Take a breath and see how far you've come.
            </p>
          </div>
          <button className="rep-export-btn">⬇ Export Report</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#9b82cc", fontSize: 18 }}>
            🌿 Loading your report...
          </div>
        ) : (
          <>
            {/* Row 1: Monthly Essence + Distribution */}
            <div className="rep-row-2">

              {/* Monthly Essence */}
              <div className="rep-essence-card">
                <h3 className="rep-card-title">Monthly Essence</h3>
                <div className="rep-essence-stats">
                  <div className="rep-essence-stat">
                    <span className="rep-essence-label">AVERAGE MOOD</span>
                    <span className="rep-essence-val">
                      {report?.avgScore >= 4 ? "Happy" : report?.avgScore >= 3 ? "Calm" : report?.avgScore >= 2 ? "Neutral" : "Sad"}
                      <span className="rep-val-icon">🍃</span>
                    </span>
                  </div>
                  <div className="rep-essence-stat">
                    <span className="rep-essence-label">LOGGED DAYS</span>
                    <span className="rep-essence-val">
                      {total} <span className="rep-val-sub">/30</span>
                    </span>
                  </div>
                  <div className="rep-essence-stat">
                    <span className="rep-essence-label">AVG SCORE</span>
                    <span className="rep-essence-val">{report?.avgScore || 0}</span>
                  </div>
                  <div className="rep-essence-stat">
                    <span className="rep-essence-label">CONSISTENCY</span>
                    <span className="rep-essence-val rep-val-high">
                      {total >= 20 ? "High" : total >= 10 ? "Medium" : "Low"}
                    </span>
                  </div>
                </div>

                <div className="rep-insight-box">
                  <div className="rep-insight-header">
                    <span className="rep-insight-icon">✦</span>
                    <span className="rep-insight-title">Insight of the Month</span>
                  </div>
                  <p className="rep-insight-text">
                    {total > 0
                      ? `You logged ${total} mood entries this month with an average score of ${report?.avgScore}. ${positivePct >= 60 ? "You had mostly positive days — great job!" : "Keep going, every entry helps you understand yourself better."}`
                      : "No entries this month yet. Start logging your mood from the Dashboard!"}
                  </p>
                </div>
              </div>

              {/* Mood Distribution */}
              <div className="rep-dist-card">
                <h3 className="rep-card-title">Mood Distribution</h3>
                <div className="rep-donut-wrap">
                  <Donut pct={positivePct} size={130} stroke={16} />
                  <div className="rep-donut-center">
                    <span className="rep-donut-pct">{positivePct}%</span>
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
                  {distribution.length === 0 && (
                    <p style={{ fontSize: 13, color: "#c0b0d8" }}>No data yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mood Trendline */}
            <div className="rep-trend-card">
              <div className="rep-trend-header">
                <h3 className="rep-card-title">Mood Trendline</h3>
                <span className="rep-trend-legend">
                  <span className="rep-trend-dot" /> Mood Score
                </span>
              </div>
              <div className="rep-trend-chart-wrap">
                {trendPoints.length > 1 ? (
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" className="rep-trend-svg">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#7c5cbf" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#7c5cbf" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#areaGrad)" />
                    <path d={linePath} fill="none" stroke="#7c5cbf" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", color: "#c0b0d8", fontSize: 14 }}>
                    Log more entries to see your trend line 🌿
                  </div>
                )}
                <div className="rep-trend-labels">
                  {["Start", "", "", "", "", "End"].map((l, i) => (
                    <span key={i} className="rep-trend-label">{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection Highlights */}
            {highlights.length > 0 && (
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
            )}
          </>
        )}
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
