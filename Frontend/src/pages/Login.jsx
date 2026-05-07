import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Seeded test accounts (must match seeder.js exactly) ──
const ACCOUNTS = [
  { email: "sarah@gmail.com",  password: "Sarah123",  role: "user"      },
  { email: "omar@gmail.com",   password: "Omar123",   role: "user"      },
  { email: "lina@moody.com",   password: "Lina123",   role: "therapist" },
  { email: "ahmad@moody.com",  password: "Ahmad123",  role: "therapist" },
];

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [loginError, setLoginError]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail]         = useState("");
  const [forgotStep, setForgotStep]           = useState("input");
  const [forgotError, setForgotError]         = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setLoginError(""); // clear general error on typing
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.password)
      newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Step 1 — field validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Step 2 — check against seeded accounts
    const account = ACCOUNTS.find(
      a => a.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (!account) {
      // Email not found
      setErrors({ email: "No account found with this email address." });
      return;
    }

    if (account.password !== formData.password) {
      // Wrong password
      setErrors({ password: "Incorrect password. Please try again." });
      setLoginError("The email or password you entered is incorrect.");
      return;
    }

    // Step 3 — success, redirect based on role
    if (account.role === "therapist") {
      navigate("/therapist");
    } else {
      navigate("/dashboard");
    }
  };

  const handleForgotSubmit = () => {
    if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setForgotError("Please enter a valid email address.");
      return;
    }
    setForgotError("");
    setForgotStep("sent");
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotStep("input");
    setForgotError("");
  };

  const isFormFilled = formData.email && formData.password;

  return (
    <div className="auth-root">

      <div className="auth-blob auth-blob-tl" />
      <div className="auth-blob auth-blob-br" />

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div style={overlay}>
          <div style={modal}>
            {forgotStep === "input" ? (
              <>
                <div style={modalHeader}>
                  <div style={{ fontSize: "48px" }}>🔑</div>
                  <h3 style={modalTitle}>Forgot Password?</h3>
                  <p style={modalSub}>
                    Enter your email and we will send you a link to reset your password.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={modalLabel}>EMAIL ADDRESS</label>
                  <input
                    style={{ ...modalInput, borderColor: forgotError ? "#e57373" : "#e0d8f0" }}
                    type="email"
                    placeholder="hello@example.com"
                    value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleForgotSubmit()}
                  />
                  {forgotError && (
                    <span style={{ fontSize: "12px", color: "#e57373" }}>{forgotError}</span>
                  )}
                </div>

                <button style={modalBtn} onClick={handleForgotSubmit}>
                  Send Reset Link
                </button>
                <button style={modalCancel} onClick={closeForgotModal}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={modalHeader}>
                  <div style={{ fontSize: "48px" }}>✅</div>
                  <h3 style={modalTitle}>Check Your Email!</h3>
                  <p style={modalSub}>We sent a password reset link to:</p>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#5b3fa0", margin: 0 }}>
                    {forgotEmail}
                  </p>
                  <p style={modalSub}>
                    Click the link in the email to reset your password.
                    The link will expire in 15 minutes.
                  </p>
                </div>
                <button style={modalBtn} onClick={closeForgotModal}>
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LOGIN CARD ── */}
      <div className="auth-card">

        <div className="auth-logo-wrap">
          <span className="auth-logo">Moody</span>
          <p className="auth-logo-sub">THE DIGITAL COCOON</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Users and therapists can log in here.</p>

        {/* General error banner */}
        {loginError && (
          <div style={errorBanner}>
            ⚠ {loginError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix-icon">✉</span>
              <input
                className={`auth-input auth-input-prefixed ${errors.email ? "auth-input-error" : ""}`}
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <span className="auth-error-msg">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix-icon">🔒</span>
              <input
                className={`auth-input auth-input-prefixed ${errors.password ? "auth-input-error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="············"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && (
              <span className="auth-error-msg">{errors.password}</span>
            )}
          </div>

          {/* Security note */}
          <div className="auth-therapist-note">
            <span className="auth-note-icon">🔒</span>
            <span>Your connection is secure and your emotional data is encrypted.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`auth-submit-btn ${!isFormFilled ? "auth-submit-disabled" : ""}`}
          >
            Enter Cocoon →
          </button>

          <p className="auth-switch">
            New to Moody?{" "}
            <Link to="/signup" className="auth-switch-link">Create a user account</Link>
          </p>

        </form>

        <div className="login-dots">
          <span className="login-dot login-dot-active" />
          <span className="login-dot" />
          <span className="login-dot" />
        </div>

        <div className="auth-footer-links">
          <a href="#" className="auth-footer-link">PRIVACY</a>
          <a href="#" className="auth-footer-link">TERMS</a>
          <a href="#" className="auth-footer-link">SUPPORT</a>
        </div>

        <p className="login-copy">© 2026 MOODY.</p>
      </div>
    </div>
  );
}

// ── Modal styles ──
const overlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(45, 31, 78, 0.55)",
  backdropFilter: "blur(6px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};
const modal = {
  background: "#fff",
  borderRadius: "24px",
  padding: "40px 36px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 24px 60px rgba(90,60,160,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};
const modalHeader = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};
const modalTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "22px",
  fontWeight: "700",
  color: "#2d1f4e",
  margin: 0,
};
const modalSub = {
  fontSize: "14px",
  color: "#8a7aaa",
  lineHeight: "1.6",
  margin: 0,
  textAlign: "center",
};
const modalLabel = {
  fontSize: "10.5px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  color: "#7a6a9a",
};
const modalInput = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "12px",
  border: "1.5px solid #e0d8f0",
  background: "#f8f5ff",
  fontSize: "14px",
  color: "#2d1f4e",
  outline: "none",
  fontFamily: "inherit",
};
const modalBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #7c5cbf, #5b3fa0)",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 6px 20px rgba(91,63,160,0.3)",
};
const modalCancel = {
  width: "100%",
  padding: "12px",
  borderRadius: "14px",
  border: "1.5px solid #e0d8f0",
  background: "transparent",
  color: "#8a7aaa",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
};
const errorBanner = {
  background: "#fff5f5",
  border: "1.5px solid #e57373",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "13.5px",
  color: "#c62828",
  fontWeight: "500",
  marginBottom: "4px",
};
