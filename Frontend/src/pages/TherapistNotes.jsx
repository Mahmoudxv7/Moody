import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNotes, createNote, deleteNote } from "../services/noteService";
import { getAssignedPatients } from "../services/therapistService";
import { getCurrentUser, logout } from "../services/authService";

const navItems = [
  { icon: "⊞", label: "Overview",  path: "/therapist",          active: false },
  { icon: "👤", label: "Patients",  path: "/therapist/patients", active: false },
  { icon: "📋", label: "Notes",     path: "/therapist/notes",    active: true  },
  { icon: "⚙",  label: "Settings", path: "#",                   active: false },
];

export default function TherapistNotes() {
  const navigate = useNavigate();
  const user     = getCurrentUser();

  const [notes,        setNotes]        = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [showNewNote,  setShowNewNote]  = useState(false);
  const [newNoteText,  setNewNoteText]  = useState("");
  const [newPatientId, setNewPatientId] = useState("");
  const [newTags,      setNewTags]      = useState("");
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, patientsData] = await Promise.all([
          getNotes(),
          getAssignedPatients(),
        ]);
        setNotes(notesData);
        setPatients(patientsData);
        if (patientsData.length > 0) {
          setNewPatientId(patientsData[0].userID?._id || "");
        }
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !newPatientId) return;
    try {
      setSaving(true);
      const tags = newTags.split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
      const newNote = await createNote({
        userID:   newPatientId,
        noteText: newNoteText,
        tags,
      });
      setNotes([newNote, ...notes]);
      setNewNoteText("");
      setNewTags("");
      setShowNewNote(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = notes.filter(n =>
    n.noteText?.toLowerCase().includes(search.toLowerCase()) ||
    n.userID?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const tagColorMap = {
    "ANXIETY":      "tag-red",
    "FOLLOW-UP":    "tag-blue",
    "BURNOUT":      "tag-orange",
    "INTAKE":       "tag-gray",
    "RELATIONSHIPS":"tag-green",
    "REVIEW":       "tag-blue",
    "PROGRESS":     "tag-green",
    "CLINICAL":     "tag-purple",
    "STABLE":       "tag-green",
  };

  const initialsColors = ["initials-pink", "initials-orange", "initials-purple", "initials-teal"];

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
          <button className="td-new-note-btn" onClick={() => setShowNewNote(true)}>
            + New Note
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="td-main">

        {/* Top bar */}
        <div className="td-topbar">
          <h2 className="td-topbar-title">Clinical Notes</h2>
          <div className="td-topbar-right">
            <button className="db-icon-btn">🔔</button>
            <button className="td-logout-btn" onClick={handleLogout}>↪ Logout</button>
          </div>
        </div>

        {/* Content */}
        <div className="td-content">

          <div className="tn-header">
            <h1 className="tn-title">Clinical Notes</h1>
            <p className="tn-subtitle">Review and manage documentation across your patient list.</p>
          </div>

          {/* Toolbar */}
          <div className="tn-toolbar">
            <div className="tp-search-wrap" style={{ flex: 1 }}>
              <span className="tp-search-icon">🔍</span>
              <input
                className="tp-search-input"
                type="text"
                placeholder="Search within notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="tn-filter-select">
              <option>All Patients</option>
              {patients.map((p, i) => (
                <option key={i}>{p.userID?.fullName}</option>
              ))}
            </select>
            <button className="tn-sort-btn">▼ Sort</button>
          </div>

          {/* New Note form */}
          {showNewNote && (
            <div className="tn-new-note-form">
              <div className="tn-new-note-header">
                <h3 className="tn-new-note-title">New Clinical Note</h3>
                <button className="tn-close-btn" onClick={() => setShowNewNote(false)}>✕</button>
              </div>

              {/* Patient selector */}
              <select
                className="tn-filter-select"
                value={newPatientId}
                onChange={e => setNewPatientId(e.target.value)}
              >
                {patients.map((p, i) => (
                  <option key={i} value={p.userID?._id}>
                    {p.userID?.fullName}
                  </option>
                ))}
              </select>

              <textarea
                className="tn-new-note-textarea"
                placeholder="Write your clinical observation..."
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
              />

              <input
                className="tp-search-input"
                type="text"
                placeholder="Tags (comma separated, e.g. Anxiety, Follow-up)"
                value={newTags}
                onChange={e => setNewTags(e.target.value)}
              />

              <div className="tn-new-note-actions">
                <button className="tn-cancel-btn" onClick={() => setShowNewNote(false)}>Cancel</button>
                <button className="tn-save-note-btn" onClick={handleAddNote} disabled={saving}>
                  {saving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          )}

          {/* Notes list */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9b82cc" }}>
              🌿 Loading notes...
            </div>
          ) : (
            <div className="tn-notes-list">
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#c0b0d8" }}>
                  No notes found. Click "+ New Note" to add one!
                </div>
              ) : (
                filtered.map((note, i) => (
                  <div key={i} className="tn-note-card">
                    <div className="tn-note-left">
                      <div className={`tn-note-initials ${initialsColors[i % initialsColors.length]}`}>
                        {note.userID?.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "??"}
                      </div>
                    </div>
                    <div className="tn-note-content">
                      <div className="tn-note-header-row">
                        <span className="tn-note-patient">{note.userID?.fullName || "Unknown"}</span>
                        <span className="tn-note-date">
                          {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "2-digit", year: "numeric"
                          }).toUpperCase()}
                        </span>
                      </div>
                      <p className="tn-note-text">{note.noteText}</p>
                      <div className="tn-note-tags">
                        {note.tags?.map((tag, j) => (
                          <span key={j} className={`ct-tag ${tagColorMap[tag] || "tag-blue"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Load more */}
          <div className="tn-load-more-wrap">
            <p className="tp-showing">SHOWING {filtered.length} OF {notes.length} NOTES</p>
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
