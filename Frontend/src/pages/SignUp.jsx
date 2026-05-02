import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Please enter a valid email address.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
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
      const data = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      // Redirect based on role
      if (data.role === "Therapist") {
        navigate("/therapist");
      } else {
        navigate("/choose-therapist");
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = {
    length:  formData.password.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    number:  /\d/.test(formData.password),
  };

  const isFormFilled =
    formData.fullName && formData.email && formData.password && formData.confirmPassword;

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-tl" />
      <div className="auth-blob auth-blob-br" />

      <div className="auth-card">
        <div className="auth-logo-wrap">
          <span className="auth-logo">Moody</span>
          <p className="auth-logo-sub">Step into your digital cocoon.</p>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Welcome to a softer way of tracking your emotional well-being.</p>

        {serverError && <p className="auth-error-msg" style={{ textAlign: "center", marginBottom: 12 }}>{serverError}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label">FULL NAME</label>
            <input
              className={`auth-input ${errors.fullName ? "auth-input-error" : ""}`}
              type="text"
              name="fullName"
              placeholder="How should we call you?"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="auth-error-msg">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">EMAIL ADDRESS</label>
            <div className="auth-input-wrap">
              <input
                className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                type="email"
                name="email"
                placeholder="hello@moody"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="auth-input-icon auth-icon-error">⊗</span>}
            </div>
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password row */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">PASSWORD</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <span className="auth-error-msg">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">CONFIRM PASSWORD</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input ${errors.confirmPassword ? "auth-input-error" : ""}`}
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button type="button" className="auth-toggle-pw" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <span className="auth-error-msg">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Password strength */}
          <div className="auth-pw-checks">
            <div className={`auth-pw-check ${passwordChecks.length ? "check-pass" : ""}`}>
              {passwordChecks.length ? "✓" : "○"} At least 8 characters
            </div>
            <div className={`auth-pw-check ${passwordChecks.special ? "check-pass" : ""}`}>
              {passwordChecks.special ? "✓" : "○"} One special character & one number
            </div>
          </div>

          {/* Therapist note */}
          <div className="auth-therapist-note">
            <span className="auth-note-icon">ℹ</span>
            <span>
              Looking for a professional dashboard?{" "}
              <strong>Therapist accounts</strong> are pre-created by the platform administrator.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`auth-submit-btn ${(!isFormFilled || loading) ? "auth-submit-disabled" : ""}`}
            disabled={!isFormFilled || loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">Login</Link>
          </p>
        </form>

        <div className="auth-footer-links">
          <a href="#" className="auth-footer-link">PRIVACY POLICY</a>
          <a href="#" className="auth-footer-link">SUPPORT</a>
          <a href="#" className="auth-footer-link">TERMS</a>
        </div>
      </div>
    </div>
  );
}
