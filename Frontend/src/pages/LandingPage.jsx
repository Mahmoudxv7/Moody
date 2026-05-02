import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const quotes = [
  { text: "Self-awareness is not a destination, but a gentle daily practice of coming home to yourself.", author: "MARGARET VAN SELBY" },
  { text: "Your emotions are like waves, they come and go. You are the ocean, vast and enduring.", author: "MOODY" },
  { text: "Small progress is still progress.", author: "YOUSIF V. S." },
];

const features = [
  {
    icon: "⊙",
    title: "Daily Mood Logging",
    desc: "Take a moment to pause and reflect. Use our simple emotional state tracker to help you track your mood in seconds.",
    colorClass: "feat-purple",
  },
  {
    icon: "↗",
    title: "Reflection Journal",
    desc: "Go deeper than emojis. Capture your thoughts and feelings that shaped your day and reflect on the moments of light found.",
    colorClass: "feat-blue",
  },
  {
    icon: "∿",
    title: "Monthly Insights",
    desc: "Discover your growth and see how your mood shifts and patterns that have been guiding your emotional landscape.",
    colorClass: "feat-pink",
  },
  {
    icon: "⊡",
    title: "Therapist Support",
    desc: "Discover study tools with your therapist who has been carefully curated for you to provide deep and helpful support.",
    colorClass: "feat-img",
    hasImage: true,
  },
];

const steps = [
  {
    num: "1",
    icon: "👤",
    title: "Sign up",
    desc: "Create your profile in a few minutes. All fields are secure and pre-populated from your personal and professional details into your data.",
  },
  {
    num: "2",
    icon: "📋",
    title: "Log your mood daily",
    desc: "Record how you feel each day, add emotions, sleep quality, life events, and more. Just press save and you're done.",
  },
  {
    num: "3",
    icon: "✦",
    title: "Stay aware",
    desc: "Read the monthly report to understand the complete picture of your emotional self awareness and make better decisions.",
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`animated-section ${inView ? "in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const q = quotes[quoteIdx];

  return (
    <div className="lp-root">

      {/* ── NAVBAR ── */}
      <nav className={`lp-nav ${scrolled ? "lp-nav-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <span className="lp-logo">Moody</span>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how-it-works" className="lp-nav-link">How it Works</a>
            <a href="#about" className="lp-nav-link">About</a>
          </div>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-login-btn">Login</Link>
            <Link to="/signup" className="lp-get-started-btn">Get Started</Link>
          </div>
          <button className="lp-hamburger" onClick={() => setMenuOpen(o => !o)}>☰</button>
        </div>
        {menuOpen && (
          <div className="lp-mobile-menu">
            <a href="#features" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>How it Works</a>
            <a href="#about" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>About</a>
            <Link to="/login" className="lp-mobile-link">Login</Link>
            <Link to="/signup" className="lp-mobile-link lp-mobile-cta">Get Started →</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-left">
            <h1 className="lp-hero-title">
              Track your<br />
              <em className="lp-hero-em">feelings.</em><br />
              Understand<br />
              yourself better.
            </h1>
            <p className="lp-hero-sub">
              Dive into your digital cocoon. A gentle space designed to help you navigate your emotional landscape with clarity and compassion.
            </p>
            <div className="lp-hero-btns">
              <Link to="/signup" className="lp-btn-primary">Get Started</Link>
              <Link to="/login" className="lp-btn-secondary">Login</Link>
            </div>
          </div>
          <div className="lp-hero-right">
            <div className="lp-hero-illustration">
              <div className="lp-hero-circle lp-hero-circle-1" />
              <div className="lp-hero-circle lp-hero-circle-2" />
              <div className="lp-hero-figure">🧘</div>
              <div className="lp-hero-plant lp-plant-left">🌿</div>
              <div className="lp-hero-plant lp-plant-right">🌱</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-features-section">
        <AnimatedSection>
          <p className="lp-features-eyebrow">THE MOODY PROMISE</p>
          <h2 className="lp-features-title">Features for Flourishing</h2>
        </AnimatedSection>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className={`lp-feat-card ${f.colorClass}`}>
                {f.hasImage && (
                  <div className="lp-feat-therapist-img">
                    <span>👨‍⚕️</span>
                  </div>
                )}
                <div className="lp-feat-icon">{f.icon}</div>
                <h3 className="lp-feat-title">{f.title}</h3>
                <p className="lp-feat-desc">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="lp-steps-section">
        <AnimatedSection>
          <p className="lp-steps-eyebrow">The Journey to Mindfulness</p>
          <p className="lp-steps-sub">Moody steps in to help you build a healthier relationship with your emotions.</p>
        </AnimatedSection>
        <div className="lp-steps-row">
          {steps.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div className="lp-step-card">
                <div className="lp-step-num-circle">{s.num}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── PROFESSIONAL SUPPORT ── */}
      <section id="about" className="lp-support-section">
        <div className="lp-support-inner">
          <div className="lp-support-left">
            <h2 className="lp-support-title">
              Professional Support<br />When You Need It
            </h2>
            <p className="lp-support-desc">
              Choosing a therapist means taking the first step towards change. Moody connects you with a range of therapist specialties. From anxiety to grief, a helping hand that is invited by you and always at your side.
            </p>
            <Link to="/choose-therapist" className="lp-support-btn">Find Out More</Link>
          </div>
          <div className="lp-support-right">
            <div className="lp-support-img-placeholder">
              <span className="lp-support-emoji">🙏</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="lp-quote-section">
        <div className="lp-quote-inner">
          <div className="lp-quote-icon">❝❞</div>
          <p key={quoteIdx} className="lp-quote-text">"{q.text}"</p>
          <span className="lp-quote-author">— {q.author}</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <span className="lp-footer-logo">Moody</span>
          </div>
          <div className="lp-footer-links-row">
            <a href="#" className="lp-footer-link">PRIVACY POLICY</a>
            <a href="#" className="lp-footer-link">TERMS OF SERVICE</a>
            <a href="#" className="lp-footer-link">SUPPORT</a>
            <a href="#" className="lp-footer-link">CONTACT</a>
          </div>
          <div className="lp-footer-social">
            <a href="#" className="lp-social-icon">𝕏</a>
            <a href="#" className="lp-social-icon">⊕</a>
          </div>
          <p className="lp-footer-copy">© 2024 MOODY. DESIGNED FOR YOUR DIGITAL COCOON.</p>
        </div>
      </footer>

    </div>
  );
}
