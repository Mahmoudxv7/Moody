import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState({ email: "", password: "" });
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const data = await login(formData);
      // Redirect based on role
      if (data.role === "Therapist") {
        navigate("/therapist");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = formData.email && formData.password;

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-tl" />
      <div className="auth-blob auth-blob-br" />

      <div className="auth-card">
        <div className="auth-logo-wrap">
          <span className="auth-logo">Moody</span>
          <p className="auth-logo-sub">THE DIGITAL COCOON</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Users and therapists can log in here.</p>

        {serverError && <p className="auth-error-msg" style={{ textAlign: "center", marginBottom: 12 }}>{serverError}</p>}

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
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <a href="#" className="auth-forgot-link">Forgot password?</a>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix-icon">🔒</span>
              <input
                className={`auth-input auth-input-prefixed ${errors.password ? "auth-input-error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <span className="auth-error-msg">{errors.password}</span>}
          </div>

          {/* Security note */}
          <div className="auth-therapist-note">
            <span className="auth-note-icon">🔒</span>
            <span>Your connection is secure and your emotional data is encrypted.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`auth-submit-btn ${(!isFormFilled || loading) ? "auth-submit-disabled" : ""}`}
            disabled={!isFormFilled || loading}
          >
            {loading ? "Entering..." : "Enter Cocoon →"}
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

        <p className="login-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
      </div>
    </div>
  );
}
