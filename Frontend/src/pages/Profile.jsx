import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { updateUser } from "../services/userService";
import { getAssignment } from "../services/therapistService";

export default function Profile() {
  const navigate  = useNavigate();
  const user      = getCurrentUser();

  const [fullName, setFullName]       = useState(user?.fullName || "");
  const [email]                       = useState(user?.email || "");
  const [successMsg, setSuccessMsg]   = useState(false);
  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [pwError, setPwError]         = useState("");
  const [pwSuccess, setPwSuccess]     = useState("");
  const [saving, setSaving]           = useState(false);
  const [therapist, setTherapist]     = useState(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Load assigned therapist
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const assignment = await getAssignment(user._id);
        setTherapist(assignment?.therapistID);
      } catch (err) {
        // No assignment found - that's okay
      }
    };
    if (user?._id) fetchAssignment();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateUser(user._id, { fullName });
      // Update localStorage
      const updatedUser = { ...user, fullName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!currentPw)          { setPwError("Please enter your current password."); return; }
    if (newPw.length < 8)    { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    try {
      await updateUser(user._id, { password: newPw });
      setPwSuccess("Password updated successfully!");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setPwSuccess(""), 3000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="prof-root">

      {/* ── NAVBAR ── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/" className="db-logo">Moody</Link>
          <div className="db-nav-links">
            <Link to="/dashboard" className="db-nav-link">Dashboard</Link>
            <Link to="/calendar"  className="db-nav-link">History</Link>
            <Link to="/report"    className="db-nav-link">Reports</Link>
            <Link to="/profile"   className="db-nav-link db-nav-active">Profile</Link>
          </div>
          <div className="db-nav-right">
            <button className="db-icon-btn">🔔</button>
            <button className="db-icon-btn" onClick={handleLogout} title="Logout">↪</button>
            <div className="db-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="prof-body">

        {/* Success Banner */}
        {successMsg && (
          <div className="prof-success-banner">
            <span className="prof-success-icon">✓</span>
            <span>Profile updated successfully. Your cocoon is refreshed.</span>
            <button className="prof-banner-close" onClick={() => setSuccessMsg(false)}>✕</button>
          </div>
        )}

        <div className="prof-layout">

          {/* ── LEFT SIDEBAR ── */}
          <div className="prof-sidebar">
            <div className="prof-avatar-wrap">
              <div className="prof-avatar">🧑</div>
              <button className="prof-avatar-edit">✏</button>
            </div>
            <p className="prof-name">{fullName}</p>
            <p className="prof-role">Mindfulness Practitioner</p>

            {/* Assigned Therapist */}
            <div className="prof-therapist-card">
              <p className="prof-therapist-label">Assigned Therapist</p>
              {therapist ? (
                <div className="prof-therapist-row">
                  <div className="prof-therapist-avatar">👩‍⚕️</div>
                  <div>
                    <p className="prof-therapist-name">{therapist.fullName}</p>
                    <span className="prof-active-badge">● ACTIVE STATUS</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "#9b82cc" }}>No therapist assigned yet.</p>
              )}
              <Link to="/choose-therapist" className="prof-change-therapist">
                {therapist ? "Change therapist" : "Choose a therapist"}
              </Link>
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="prof-content">

            {/* Profile Info */}
            <div className="prof-section">
              <h2 className="prof-section-title">Profile Info</h2>
              <p className="prof-section-sub">Update your personal sanctuary details.</p>

              <div className="prof-fields">
                <div className="prof-field">
                  <label className="prof-label">FULL NAME</label>
                  <input
                    className="prof-input"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>

                <div className="prof-field">
                  <label className="prof-label">EMAIL ADDRESS</label>
                  <div className="prof-input-wrap">
                    <input
                      className="prof-input prof-input-readonly"
                      type="email"
                      value={email}
                      readOnly
                    />
                    <span className="prof-input-lock">🔒</span>
                  </div>
                  <p className="prof-field-note">CONTACT SUPPORT TO CHANGE YOUR VERIFIED EMAIL.</p>
                </div>
              </div>

              <button className="prof-save-btn" onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save changes 💾"}
              </button>
            </div>

            <div className="prof-divider" />

            {/* Security */}
            <div className="prof-section">
              <h2 className="prof-section-title">Security</h2>
              <p className="prof-section-sub">Manage your digital keys.</p>

              <div className="prof-fields">
                <div className="prof-field">
                  <label className="prof-label">CURRENT PASSWORD</label>
                  <div className="prof-input-wrap">
                    <input
                      className="prof-input"
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPw}
                      placeholder="••••••••••••"
                      onChange={e => setCurrentPw(e.target.value)}
                    />
                    <button className="prof-pw-toggle" onClick={() => setShowCurrentPw(v => !v)}>
                      {showCurrentPw ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div className="prof-pw-row">
                  <div className="prof-field">
                    <label className="prof-label">NEW PASSWORD</label>
                    <div className="prof-input-wrap">
                      <input
                        className="prof-input"
                        type={showNewPw ? "text" : "password"}
                        value={newPw}
                        placeholder="Enter new password"
                        onChange={e => setNewPw(e.target.value)}
                      />
                      <button className="prof-pw-toggle" onClick={() => setShowNewPw(v => !v)}>
                        {showNewPw ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">CONFIRM NEW PASSWORD</label>
                    <div className="prof-input-wrap">
                      <input
                        className="prof-input"
                        type={showConfirmPw ? "text" : "password"}
                        value={confirmPw}
                        placeholder="Repeat new password"
                        onChange={e => setConfirmPw(e.target.value)}
                      />
                      <button className="prof-pw-toggle" onClick={() => setShowConfirmPw(v => !v)}>
                        {showConfirmPw ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {pwError   && <p className="prof-pw-error">{pwError}</p>}
              {pwSuccess && <p className="prof-pw-success">{pwSuccess}</p>}

              <button className="prof-update-pw-btn" onClick={handleUpdatePassword}>
                Update Password
              </button>
            </div>

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
        <p className="db-footer-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
      </footer>

    </div>
  );
}
