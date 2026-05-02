import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTherapists, assignTherapist } from "../services/therapistService";

const tagColors = {
  "CBT EXPERT": "tag-purple",
  "CALM": "tag-purple",
  "RESILIENT": "tag-green",
  "SLEEP HYGIENE": "tag-green",
  "DEEP FOCUS": "tag-blue",
  "BALANCED": "tag-blue",
};

const cardColors = ["therapist-card-purple", "therapist-card-dark", "therapist-card-light"];
const emojis     = ["👩‍⚕️", "👨‍⚕️", "👩‍🦱"];

export default function ChooseTherapist() {
  const [therapists, setTherapists] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const navigate = useNavigate();

  // Load therapists from API
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const data = await getTherapists();
        setTherapists(data);
      } catch (err) {
        setError("Failed to load therapists. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const handleChoose = async (therapistId) => {
    try {
      setSelected(therapistId);
      await assignTherapist(therapistId);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setError("Failed to assign therapist. Please try again.");
      setSelected(null);
    }
  };

  return (
    <div className="ct-root">

      {/* ── NAVBAR ── */}
      <nav className="ct-nav">
        <div className="ct-nav-inner">
          <Link to="/" className="ct-logo">Moody</Link>
          <div className="ct-nav-right">
            <div className="ct-avatar">🧑</div>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="ct-main">
        <div className="ct-header">
          <h1 className="ct-title">Choose Your Therapist</h1>
          <p className="ct-subtitle">
            Selecting a therapist allows your mood records to be monitored for
            professional support. This digital cocoon is designed to keep you safe and
            heard throughout your journey.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: "#e57373", marginBottom: 16, fontWeight: 600 }}>{error}</div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#9b82cc", fontSize: 18 }}>
            🌿 Loading therapists...
          </div>
        ) : (
          <div className="ct-cards-row">
            {therapists.map((t, i) => (
              <div
                key={t._id}
                className={`ct-card ${cardColors[i % cardColors.length]} ${selected === t._id ? "ct-card-selected" : ""}`}
              >
                {/* Card Header */}
                <div className="ct-card-header">
                  <div className="ct-card-avatar">{emojis[i % emojis.length]}</div>
                  <div className="ct-card-info">
                    <h3 className="ct-card-name">{t.fullName}</h3>
                    <span className="ct-card-role">THERAPIST</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="ct-tags">
                  <span className="ct-tag tag-purple">SPECIALIST</span>
                  <span className="ct-tag tag-blue">WELLNESS</span>
                </div>

                {/* Description */}
                <p className="ct-card-desc">
                  A dedicated professional here to support your emotional journey
                  and help you navigate your inner landscape.
                </p>

                {/* Availability */}
                <div className="ct-availability avail-green">
                  <span className="ct-avail-dot" />
                  Available Now
                </div>

                {/* Choose Button */}
                <button
                  className={`ct-choose-btn ${selected === t._id ? "ct-choose-btn-selected" : ""}`}
                  onClick={() => handleChoose(t._id)}
                  disabled={selected !== null}
                >
                  {selected === t._id ? "✓ Selected!" : "Choose Therapist"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="ct-footer">
        <div className="ct-footer-links">
          <a href="#" className="ct-footer-link">PRIVACY POLICY</a>
          <a href="#" className="ct-footer-link">TERMS OF SERVICE</a>
          <a href="#" className="ct-footer-link">SUPPORT</a>
          <a href="#" className="ct-footer-link">CONTACT</a>
        </div>
        <p className="ct-footer-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
      </footer>

    </div>
  );
}
