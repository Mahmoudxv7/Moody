import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAssignedPatients } from "../services/therapistService";
import { getNotes } from "../services/noteService";
import { getCurrentUser, logout } from "../services/authService";

const navItems = [
  { icon: "⊞", label: "Overview",  path: "/therapist",          active: true  },
  { icon: "👤", label: "Patients",  path: "/therapist/patients", active: false },
  { icon: "📋", label: "Notes",     path: "/therapist/notes",    active: false },
  { icon: "⚙",  label: "Settings", path: "#",                   active: false },
];

export default function TherapistDashboard() {
  const navigate = useNavigate();
  const user     = getCurrentUser();

  const [patients, setPatients] = useState([]);
  const [notes,    setNotes]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, notesData] = await Promise.all([
          getAssignedPatients(),
          getNotes(),
        ]);
        setPatients(patientsData);
        setNotes(notesData);
      } catch (err) {
        console.error("Failed to load therapist data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const ecosystemBars = [55, 75, 90, 80, 60, 45, 70, 50];

  return (
    <div className="td-root">

      {/* ── SIDEBAR ── */}
      <aside className="td-sidebar">
        <div className="td-sidebar-top">
          <div className="td-logo">Moody</div>
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
          <div className="td-doctor-avatar">👨‍⚕️</div>
          <div className="td-doctor-info">
            <p className="td-doctor-name">{user?.fullName || "Dr. Smith"}</p>
            <p className="td-doctor-role">CLINICAL WELLNESS</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="td-main">

        {/* Top bar */}
        <div className="td-topbar">
          <h2 className="td-topbar-title">Clinical Dashboard</h2>
          <div className="td-topbar-right">
            <button className="db-icon-btn">🔔</button>
            <button className="td-logout-btn" onClick={handleLogout}>↪ Logout</button>
          </div>
        </div>

        {/* Content */}
        <div className="td-content">

          {/* Greeting */}
          <div className="td-greeting">
            <h1 className="td-greeting-title">Good morning, {user?.fullName || "Doctor"}.</h1>
            <p className="td-greeting-sub">
              Here is an overview of your clinical cocoon today. There are{" "}
              <strong>{patients.length} users</strong> assigned to your care.
            </p>
          </div>

          {/* Alert */}
          <div className="td-alert-banner">
            <div className="td-alert-left">
              <span className="td-alert-icon">⚠</span>
              <div>
                <p className="td-alert-title">Attention Needed</p>
                <p className="td-alert-sub">
                  Review your patients' latest mood entries to stay updated.
                </p>
              </div>
            </div>
            <button className="td-alert-btn">Review Alerts</button>
          </div>

          {/* Stats */}
          <div className="td-stats-grid">
            <div className="td-stat-card">
              <span className="td-stat-icon">👥</span>
              <span className="td-stat-value">{patients.length}</span>
              <span className="td-stat-label">ASSIGNED USERS</span>
            </div>
            <div className="td-stat-card">
              <span className="td-stat-icon">📉</span>
              <span className="td-stat-value">12%</span>
              <span className="td-stat-label">LOW MOOD TRENDS</span>
            </div>
            <div className="td-stat-card">
              <span className="td-stat-icon">📋</span>
              <span className="td-stat-value">{notes.length}</span>
              <span className="td-stat-label">NOTES THIS WEEK</span>
            </div>
            <div className="td-stat-card">
              <span className="td-stat-icon">🕐</span>
              <span className="td-stat-value">Now</span>
              <span className="td-stat-label">LAST ACTIVITY</span>
            </div>
          </div>

          {/* Patient Monitoring */}
          <div className="td-section-card">
            <div className="td-section-header">
              <h3 className="td-section-title">Patient Monitoring</h3>
              <Link to="/therapist/patients" className="td-view-all">View All Patients</Link>
            </div>

            {loading ? (
              <p style={{ color: "#9b82cc", fontSize: 14 }}>🌿 Loading patients...</p>
            ) : patients.length === 0 ? (
              <p style={{ color: "#c0b0d8", fontSize: 14 }}>No patients assigned yet.</p>
            ) : (
              <div className="td-patients-list">
                {patients.slice(0, 3).map((p, i) => (
                  <div key={i} className="td-patient-row">
                    <div className="td-patient-initials">
                      {p.userID?.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "??"}
                    </div>
                    <div className="td-patient-info">
                      <p className="td-patient-name">{p.userID?.fullName || "Unknown"}</p>
                      <p className="td-patient-id">Patient ID: {p.userID?._id?.slice(-6) || "N/A"}</p>
                    </div>
                    <div className="td-patient-mood">
                      <span className="td-mood-label-sm">STATUS</span>
                      <span className="td-mood-badge mood-calm">Active</span>
                    </div>
                    <div className="td-patient-entry">
                      <span className="td-mood-label-sm">ASSIGNED</span>
                      <span className="td-entry-date">
                        {new Date(p.assignedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="td-trend td-trend-stable">→ Stable</div>
                    <Link to={`/therapist/patients/${p.userID?._id}`} className="td-view-details">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ecosystem Pulse */}
          <div className="td-pulse-card">
            <h3 className="td-section-title" style={{ marginBottom: 6 }}>Patient Ecosystem Pulse</h3>
            <p className="td-pulse-sub">
              Overall emotional resonance across your cohort this week.
            </p>
            <div className="td-pulse-chart">
              {ecosystemBars.map((h, i) => (
                <div key={i} className="td-pulse-bar-wrap">
                  <div className="td-pulse-bar" style={{ height: `${h}%` }} />
                </div>
              ))}
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
