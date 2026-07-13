import { Link } from "react-router-dom";
import cuteRobot from "../assets/cute_robot.png";
import dashboardMockup from "../assets/dashboard_mockup.png";

export default function HomePage() {
  return (
    <div className="home-ref-layout">
      {/* 1. Gradient Wrapper (Header + Hero) */}
      <div className="home-gradient-wrapper">
        <header className="ref-header">
          <div className="ref-header-inner">
            <div className="ref-brand">MathMate</div>
            <nav className="ref-nav">
              <Link to="#">Headline</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/blog">Blog</Link>
            </nav>
            <div className="ref-auth">
              <Link to="/signup" className="ref-btn-outline">Sign Up</Link>
            </div>
          </div>
        </header>

        <section className="ref-hero">
          <div className="ref-hero-left">
            <h1 className="ref-title">Learn Math<br/>Smarter with AI</h1>
            <p className="ref-subtitle">
              Personalized tutoring and adaptive learning, adaptive learning, effects to earn AI.
            </p>
            <div className="ref-hero-actions">
              <Link to="/signup" className="ref-btn-primary">Start Learning</Link>
              <Link to="/demo" className="ref-btn-secondary">Watch Demo &gt;</Link>
            </div>
          </div>
          <div className="ref-hero-right">
             <img src={cuteRobot} alt="AI Robot" className="ref-hero-img" />
          </div>
        </section>
      </div>

      {/* 2. Features Section */}
      <section className="ref-features-section">
        <h2 className="ref-section-heading">Features</h2>
        <div className="ref-features-grid">
          <div className="ref-feature-card">
            <div className="ref-f-icon icon-purple">💬</div>
            <h3>AI Tutor</h3>
            <p>Personalized tutoring where personalized tutoring, and adaptive learning.</p>
          </div>
          <div className="ref-feature-card">
            <div className="ref-f-icon icon-blue">📊</div>
            <h3>Interactive Graphs</h3>
            <p>Soft shadows renders with a custom handed canvas and hover effects.</p>
          </div>
          <div className="ref-feature-card">
            <div className="ref-f-icon icon-purple">📋</div>
            <h3>Personalized Learning Paths</h3>
            <p>Personalized learning paths create a path and simple can rounded 24px.</p>
          </div>
        </div>
      </section>

      {/* 3. Product Showcase */}
      <section className="ref-showcase-section">
        <h2 className="ref-section-heading">Product Showcase</h2>
        <p className="ref-showcase-sub">Beautiful dashboard UI mockup</p>
        <div className="ref-showcase-img-wrapper">
           <img src={dashboardMockup} alt="Dashboard UI" className="ref-showcase-img" />
        </div>
      </section>
    </div>
  );
}
