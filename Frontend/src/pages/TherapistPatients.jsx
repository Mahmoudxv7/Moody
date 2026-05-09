import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAssignedPatients } from "../services/therapistService";
import { getCurrentUser, logout } from "../services/authService";

const filters = ["All Users", "High Sensitivity", "New Reflections", "Inactive > 3 days"];

const navItems = [
  { icon: "⊞", label: "Overview", path: "/therapist",          active: false },
  { icon: "👤", label: "Patients", path: "/therapist/patients", active: true  },
  { icon: "📋", label: "Notes",    path: "/therapist/notes",    active: false },
];

const mockPatients = [
  { _id: "1", userID: { fullName: "Sarah Ahmed"  }, lastMood: "Happy",   lastActive: "Today, 9:30 AM",    reflection: "Feeling energetic today. The morning walk really helped my mood." },
  { _id: "2", userID: { fullName: "Omar Malik"   }, lastMood: "Neutral", lastActive: "Yesterday",         reflection: "Normal day. Nothing special but nothing bad either." },
  { _id: "3", userID: { fullName: "Layla Karimi" }, lastMood: "Sad",     lastActive: "2 days ago",        reflection: "Feeling a bit down today. Need some rest and quiet time." },
  { _id: "4", userID: { fullName: "Youssef Amin" }, lastMood: "Calm",    lastActive: "Today, 2:15 PM",    reflection: "Peaceful day. Journaled and reflected on the week." },
];

export default function TherapistPatients() {
  const navigate = useNavigate();
  const user     = getCurrentUser();

  const [patients, setPatients]         = useState([]);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All Users");
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAssignedPatients();
        setPatients(data.length > 0 ? data : mockPatients);
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const filtered = patients.filter(p =>
    p.userID?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h2 className="td-topbar-title">Assigned Users</h2>
          <div className="td-topbar-right">
            <span className="tp-date">📅 {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
          </div>
        </div>

        {/* Content */}
        <div className="td-content">

          <div className="tp-header">
            <div>
              <h1 className="tp-title">Assigned Users</h1>
              <p className="tp-subtitle">Managing {patients.length} active journeys in your care.</p>
            </div>
          </div>

          {/* Search */}
          <div className="tp-search-wrap">
            <span className="tp-search-icon">🔍</span>
            <input
              className="tp-search-input"
              type="text"
              placeholder="Search for a name or mood keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div className="tp-filters-row">
            <div className="tp-filter-tabs">
              {filters.map(f => (
                <button
                  key={f}
                  className={`tp-filter-tab ${activeFilter === f ? "tp-filter-active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="tp-advanced-btn">▼ Advanced Filters</button>
          </div>

          {/* Table */}
          <div className="tp-table-card">
            <div className="tp-table-header">
              <span className="tp-col-label">USER DETAILS</span>
              <span className="tp-col-label">CURRENT VIBE</span>
              <span className="tp-col-label">STATUS</span>
              <span className="tp-col-label">ASSIGNED DATE</span>
              <span />
            </div>

            <div className="tp-table-body">
              {loading ? (
                <div style={{ padding: 32, textAlign: "center", color: "#9b82cc" }}>
                  🌿 Loading patients...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center", color: "#c0b0d8" }}>
                  No patients found.
                </div>
              ) : (
                filtered.map((p, i) => (
                  <div key={i} className="tp-table-row">
                    {/* User details */}
                    <div className="tp-user-details">
                      <div className="tp-user-initials">
                        {p.userID?.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "??"}
                      </div>
                      <div>
                        <p className="tp-user-name">{p.userID?.fullName || "Unknown"}</p>
                        <p className="tp-user-id">User ID: {p.userID?._id?.slice(-6) || "N/A"}</p>
                      </div>
                    </div>

                    {/* Vibe */}
                    <div>
                      <span className="td-mood-badge mood-calm">Active</span>
                    </div>

                    {/* Status */}
                    <div className="tp-last-active">{p.status}</div>

                    {/* Assigned date */}
                    <div className="tp-last-active">
                      {new Date(p.assignedDate).toLocaleDateString()}
                    </div>

                    {/* Arrow */}
                    <button
                      className="tp-row-arrow"
                      onClick={() => navigate(`/therapist/patients/${p.userID?._id}`)}
                    >
                      ›
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="tp-load-more-wrap">
              <p className="tp-showing">SHOWING {filtered.length} OF {patients.length} PATIENTS</p>
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
