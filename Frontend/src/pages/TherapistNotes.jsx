import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialNotes = [
  {
    id: 1,
    patientInitials: "SJ",
    patientName: "Sarah Jenkins",
    patientColor: "initials-pink",
    date: "APR 24, 2026",
    text: "Patient reports improved sleep hygiene but continues to experience mild anxiety during evening hours. Discussed grounding techniques and breathing exercises.",
    tags: ["ANXIETY", "FOLLOW-UP"],
    tagColors: ["tag-red", "tag-blue"],
  },
  {
    id: 2,
    patientInitials: "MT",
    patientName: "Marcus Thorne",
    patientColor: "initials-orange",
    date: "APR 22, 2026",
    text: "Initial intake session. Client is struggling with work-life balance and burnout. Exhibits signs of moderate depressive episode. Recommended daily mood logging.",
    tags: ["BURNOUT", "INTAKE"],
    tagColors: ["tag-orange", "tag-gray"],
  },
  {
    id: 3,
    patientInitials: "ER",
    patientName: "Elena Rodriguez",
    patientColor: "initials-purple",
    date: "APR 19, 2026",
    text: "Discussed recent family conflict. Elena expressed feeling unheard in social circles. We focused on assertive communication exercises and journaling.",
    tags: ["RELATIONSHIPS"],
    tagColors: ["tag-green"],
  },
  {
    id: 4,
    patientInitials: "DC",
    patientName: "David Chen",
    patientColor: "initials-teal",
    date: "APR 15, 2026",
    text: "Summary of monthly progress. David has met 3 out of 5 therapeutic goals established last quarter. Resilience scores are up by 15%.",
    tags: ["REVIEW", "PROGRESS"],
    tagColors: ["tag-blue", "tag-green"],
  },
];

// Settings REMOVED from nav
const navItems = [
  { icon: "⊞", label: "Overview", path: "/therapist",          active: false },
  { icon: "👤", label: "Patients", path: "/therapist/patients", active: false },
  { icon: "📋", label: "Notes",    path: "/therapist/notes",    active: true  },
];

export default function TherapistNotes() {
  const [notes, setNotes]                   = useState(initialNotes);
  const [search, setSearch]                 = useState("");
  const [filterPatient, setFilterPatient]   = useState("All Patients");
  const [showNewNote, setShowNewNote]       = useState(false);
  const [newNoteText, setNewNoteText]       = useState("");
  const [newNotePatient, setNewNotePatient] = useState("Sarah Jenkins");
  const [newNoteTags, setNewNoteTags]       = useState("");
  const [saveError, setSaveError]           = useState("");
  const navigate = useNavigate();

  const filtered = notes.filter(n =>
    n.text.toLowerCase().includes(search.toLowerCase()) ||
    n.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = () => {
    // Must have note text
    if (!newNoteText.trim()) {
      setSaveError("Please write something in the note before saving.");
      return;
    }
    setSaveError("");

    const tags = newNoteTags
      .split(",")
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const newNote = {
      id: Date.now(),
      patientInitials: newNotePatient.split(" ").map(w => w[0]).join("").slice(0, 2),
      patientName: newNotePatient,
      patientColor: "initials-purple",
      date: new Date().toLocaleDateString("en-US", {
        month: "short", day: "2-digit", year: "numeric",
      }).toUpperCase(),
      text: newNoteText,
      tags,
      tagColors: tags.map(() => "tag-blue"),
    };

    setNotes([newNote, ...notes]); // add to top
    setNewNoteText("");
    setNewNoteTags("");
    setNewNotePatient("Sarah Jenkins");
    setShowNewNote(false);
  };

  const closeForm = () => {
    setShowNewNote(false);
    setSaveError("");
    setNewNoteText("");
    setNewNoteTags("");
  };

  return (
    <div className="td-root">

      {/* ── SIDEBAR ── */}
      <aside className="td-sidebar">
        <div className="td-sidebar-top">
          <div className="td-logo">Moody</div>
          <div className="td-sidebar-profile">
            <div className="td-doctor-avatar">👨‍⚕️</div>
            <div className="td-doctor-info">
              <p className="td-doctor-name">Dr. Smith</p>
              <p className="td-doctor-role">CLINICAL WELLNESS</p>
            </div>
          </div>
          <nav className="td-sidebar-nav">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className={`td-nav-item ${item.active ? "td-nav-active" : ""}`}
              >
                <span className="td-nav-icon">{item.icon}</span>
                <span className="td-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="td-sidebar-bottom">
          <button
            className="td-new-note-btn"
            onClick={() => { setShowNewNote(true); setSaveError(""); }}
          >
            + New Note
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="td-main">

        <div className="td-topbar">
          <h2 className="td-topbar-title">Clinical Notes</h2>
          <div className="td-topbar-right">
            <button className="td-icon-btn">🔔</button>
            <button className="td-logout-btn" onClick={() => navigate("/login")}>
              ↪ Logout
            </button>
          </div>
        </div>

        <div className="td-content">

          <div className="tn-header">
            <h1 className="tn-title">Clinical Notes</h1>
            <p className="tn-subtitle">Review and manage documentation across your patient list.</p>
          </div>

          {/* Search only */}
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
          </div>

          {/* ── NEW NOTE FORM ── */}
          {showNewNote && (
            <div className="tn-new-note-form">
              <div className="tn-new-note-header">
                <h3 className="tn-new-note-title">New Clinical Note</h3>
                <button className="tn-close-btn" onClick={closeForm}>✕</button>
              </div>

              <select
                className="tn-filter-select"
                value={newNotePatient}
                onChange={e => { setNewNotePatient(e.target.value); setSaveError(""); }}
              >
                <option>Sarah Jenkins</option>
                <option>Marcus Thorne</option>
                <option>Elena Rodriguez</option>
                <option>David Chen</option>
              </select>

              <textarea
                className="tn-new-note-textarea"
                placeholder="Write your clinical observation..."
                value={newNoteText}
                onChange={e => { setNewNoteText(e.target.value); setSaveError(""); }}
              />

              <input
                className="tp-search-input"
                type="text"
                placeholder="Tags (comma separated, e.g. Anxiety, Follow-up)"
                value={newNoteTags}
                onChange={e => setNewNoteTags(e.target.value)}
              />

              {/* Error shown when Save Note clicked with empty text */}
              {saveError && (
                <p style={{
                  fontSize: "13px",
                  color: "#c62828",
                  background: "#fff5f5",
                  border: "1px solid #e57373",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  margin: 0,
                }}>
                  ⚠ {saveError}
                </p>
              )}

              <div className="tn-new-note-actions">
                <button className="tn-cancel-btn" onClick={closeForm}>Cancel</button>
                <button className="tn-save-note-btn" onClick={handleAddNote}>Save Note</button>
              </div>
            </div>
          )}

          {/* Notes list */}
          <div className="tn-notes-list">
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9b82cc", fontSize: "14px" }}>
                No notes found.
              </div>
            ) : (
              filtered.map((note) => (
                <div key={note.id} className="tn-note-card">
                  <div className="tn-note-left">
                    <div className={`tn-note-initials ${note.patientColor}`}>
                      {note.patientInitials}
                    </div>
                  </div>
                  <div className="tn-note-content">
                    <div className="tn-note-header-row">
                      <span className="tn-note-patient">{note.patientName}</span>
                      <span className="tn-note-date">{note.date}</span>
                    </div>
                    <p className="tn-note-text">{note.text}</p>
                    <div className="tn-note-tags">
                      {note.tags.map((tag, i) => (
                        <span key={i} className={`ct-tag ${note.tagColors[i]}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="tn-load-more-wrap">
            <button className="tp-load-more-btn">Load older notes</button>
          </div>

        </div>

        <footer className="db-footer">
          <div className="db-footer-links">
            <a href="#" className="db-footer-link">PRIVACY POLICY</a>
            <a href="#" className="db-footer-link">TERMS OF SERVICE</a>
            <a href="#" className="db-footer-link">SUPPORT</a>
            <a href="#" className="db-footer-link">CONTACT</a>
          </div>
          <p className="db-footer-copy">© 2026 MOODY.</p>
        </footer>

      </main>
    </div>
  );
}
