import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMoodEntries } from "../services/moodService";
import { createNote, getNotes } from "../services/noteService";
import { getUserById } from "../services/userService";
import { getCurrentUser, logout } from "../services/authService";
import { getAssignedPatients } from "../services/therapistService";

const moodEmojis = {
  "Very Happy": "😄",
  "Happy":      "😊",
  "Calm":       "😌",
  "Neutral":    "😐",
  "Sad":        "😢",
  "Very Sad":   "😰",
};

const navItems = [
  { icon: "⊞", label: "Overview",  path: "/therapist",          active: false },
  { icon: "👤", label: "Patients",  path: "/therapist/patients", active: true  },
  { icon: "📋", label: "Notes",     path: "/therapist/notes",    active: false },
  { icon: "⚙",  label: "Settings", path: "#",                   active: false },
];

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

export default function TherapistPatientView() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const user     = getCurrentUser();

  const [patient,    setPatient]    = useState(null);
  const [entries,    setEntries]    = useState([]);
  const [notes,      setNotes]      = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [noteText,   setNoteText]   = useState("");
  const [noteSaved,  setNoteSaved]  = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, allNotes, allPatients] = await Promise.all([
          getUserById(id),
          getNotes(),
          getAssignedPatients(),
        ]);
        setPatient(patientData);
        // Filter notes for this patient
        setNotes(allNotes.filter(n => n.userID?._id === id || n.userID === id));
        // Find assignment
        const assign = allPatients.find(p => p.userID?._id === id);
        setAssignment(assign);
      } catch (err) {
        console.error("Failed to load patient data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveNote = async () => {
    if (!noteText.trim() || !assignment) return;
    try {
      const newNote = await createNote({
        userID:   id,
        noteText,
        tags:     ["CLINICAL"],
      });
      setNotes([newNote, ...notes]);
      setNoteText("");
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  // Build trendline — use dummy data since entries belong to user not therapist
  const svgW = 480, svgH = 80;
  const dummyPoints = [
    { x:0, y:60 }, { x:80, y:30 }, { x:160, y:50 },
    { x:240, y:20 }, { x:320, y:45 }, { x:400, y:35 }, { x:480, y:55 },
  ];
  const linePath = buildPath(dummyPoints);
  const areaPath = `${linePath} L 480 ${svgH} L 0 ${svgH} Z`;

  const trendLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#9b82cc", fontSize:18 }}>
        🌿 Loading patient data...
      </div>
    );
  }

  return (
    <div className="td-root">

      {/* ── SIDEBAR ── */}
      <aside className="td-sidebar">
        <div className="td-sidebar-top">
          <div className="td-logo">Moody</div>
          <div className="td-sidebar-profile">
            <div className="td-doctor-avatar">👨‍⚕️</div>
            <div className="td-doctor-info">
              <p className="td-doctor-name">{user?.fullName || "Dr. Smith"}</p>
              <p className="td-doctor-role">CLINICAL WELLNESS</p>
            </div>
          </div>
          <nav className="td-sidebar-nav">
            {navItems.map((item, i) => (
              <Link key={i} to={item.path}
                className={`td-nav-item ${item.active ? "td-nav-active" : ""}`}>
                <span className="td-nav-icon">{item.icon}</span>
                <span className="td-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="td-sidebar-bottom">
          <button className="td-new-note-btn" onClick={() => navigate("/therapist/notes")}>
            + New Note
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="td-main">

        {/* Top bar */}
        <div className="td-topbar">
          <button className="pv-back-btn" onClick={() => navigate("/therapist/patients")}>
            ← Back to Patient List
          </button>
          <div className="td-topbar-right">
            <button className="db-icon-btn">🔔</button>
            <button className="td-logout-btn" onClick={handleLogout}>↪ Logout</button>
          </div>
        </div>

        {/* Content */}
        <div className="td-content">

          {/* Patient header */}
          <div className="pv-patient-header">
            <div className="pv-patient-left">
              <div className="pv-patient-avatar">🧑</div>
              <div>
                <div className="pv-patient-name-row">
                  <h1 className="pv-patient-name">{patient?.fullName || "Unknown Patient"}</h1>
                  <span className="td-mood-badge mood-calm pv-state-badge">ACTIVE</span>
                  <span className="pv-active-badge">ACTIVE PATIENT</span>
                </div>
                <p style={{ fontSize: 13, color: "#9b82cc", marginTop: 4 }}>{patient?.email}</p>
              </div>
            </div>
            <div className="pv-patient-meta">
              <div className="pv-meta-item">
                <span className="pv-meta-label">ASSIGNED</span>
                <span className="pv-meta-val">
                  {assignment ? new Date(assignment.assignedDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="pv-meta-item">
                <span className="pv-meta-label">STATUS</span>
                <span className="pv-meta-val pv-mood-contented">{assignment?.status || "Active"}</span>
              </div>
            </div>
          </div>

          {/* Two columns */}
          <div className="pv-body">

            {/* LEFT */}
            <div className="pv-left">

              {/* Mood Trend */}
              <div className="pv-card">
                <div className="pv-card-header">
                  <h3 className="pv-card-title">Mood Trend (7 Days)</h3>
                  <div className="pv-chart-nav">
                    <button className="db-cal-nav-btn">‹</button>
                    <button className="db-cal-nav-btn">›</button>
                  </div>
                </div>
                <div className="pv-trend-wrap">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" className="pv-trend-svg">
                    <defs>
                      <linearGradient id="pvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#7c5cbf" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#7c5cbf" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#pvAreaGrad)" />
                    <path d={linePath} fill="none" stroke="#7c5cbf" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <div className="pv-trend-labels">
                    {trendLabels.map((l, i) => (
                      <span key={i} className="rep-trend-label">{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alert + Resilience */}
              <div className="pv-alert-row">
                <div className="pv-alert-card">
                  <div className="pv-alert-header">
                    <span className="pv-alert-title">Mood Pattern Alert</span>
                    <span className="pv-alert-icon-badge">!</span>
                  </div>
                  <p className="pv-alert-text">
                    Monitor this patient's mood entries regularly for any concerning patterns.
                  </p>
                  <span className="pv-pattern-tag">PATTERN: MONITOR</span>
                </div>
                <div className="pv-resilience-card">
                  <div className="pv-resilience-header">
                    <span className="pv-resilience-title">Notes Written</span>
                    <span className="pv-resilience-icon">📋</span>
                  </div>
                  <div className="pv-resilience-pct">{notes.length}</div>
                  <p className="pv-resilience-text">
                    Clinical notes written for this patient so far.
                  </p>
                </div>
              </div>

              {/* Patient Notes Preview */}
              <div className="pv-card">
                <div className="pv-card-header">
                  <h3 className="pv-card-title">Clinical Notes</h3>
                  <Link to="/therapist/notes" className="td-view-all">View All Notes</Link>
                </div>
                {notes.length > 0 ? (
                  <div className="pv-reflections-list">
                    {notes.slice(0, 2).map((n, i) => (
                      <div key={i} className="pv-reflection-item">
                        <div className="pv-reflection-meta">
                          <span className="pv-reflection-date">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                          {n.tags?.map((t, j) => (
                            <span key={j} className="td-mood-badge mood-calm" style={{ fontSize: 10 }}>{t}</span>
                          ))}
                        </div>
                        <p className="pv-reflection-text">{n.noteText}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "#c0b0d8" }}>No notes yet for this patient.</p>
                )}
              </div>

            </div>

            {/* RIGHT */}
            <div className="pv-right">

              {/* Patient Info */}
              <div className="pv-card">
                <h3 className="pv-card-title pv-small-title">PATIENT INFO</h3>
                <div className="pv-activity-list">
                  <div className="pv-activity-item">
                    <span className="pv-activity-dot" style={{ background: "#7c5cbf" }} />
                    <span className="pv-activity-date">Name</span>
                    <span className="pv-activity-mood">{patient?.fullName}</span>
                  </div>
                  <div className="pv-activity-item">
                    <span className="pv-activity-dot" style={{ background: "#4caf50" }} />
                    <span className="pv-activity-date">Email</span>
                    <span className="pv-activity-mood">{patient?.email}</span>
                  </div>
                  <div className="pv-activity-item">
                    <span className="pv-activity-dot" style={{ background: "#f5c842" }} />
                    <span className="pv-activity-date">Status</span>
                    <span className="pv-activity-mood">{assignment?.status || "Active"}</span>
                  </div>
                </div>
              </div>

              {/* Add Clinical Note */}
              <div className="pv-card pv-notes-card">
                <div className="pv-card-header">
                  <h3 className="pv-card-title">🔒 Clinical Notes</h3>
                </div>
                <p className="pv-notes-confidential">CONFIDENTIAL — THERAPIST ONLY</p>

                <textarea
                  className="pv-notes-textarea"
                  placeholder="Add a private observation..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />

                {noteSaved && <p className="pv-note-saved">✓ Note saved successfully!</p>}

                <button className="pv-save-note-btn" onClick={handleSaveNote}>
                  💾 Save Note
                </button>

                {/* Saved notes */}
                {notes.length > 0 && (
                  <div className="pv-saved-notes">
                    {notes.map((n, i) => (
                      <div key={i} className="pv-saved-note-item">
                        <span className="pv-saved-note-date">
                          {new Date(n.createdAt).toLocaleDateString().toUpperCase()}
                        </span>
                        <p className="pv-saved-note-text">{n.noteText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="db-footer">
          <div className="db-footer-links">
            <a href="#" className="db-footer-link">PRIVACY POLICY</a>
            <a href="#" className="db-footer-link">TERMS OF SERVICE</a>
            <a href="#" className="db-footer-link">SUPPORT</a>
            <a href="#" className="db-footer-link">CONTACT</a>
          </div>
          <p className="db-footer-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
        </footer>

      </main>
    </div>
  );
}
