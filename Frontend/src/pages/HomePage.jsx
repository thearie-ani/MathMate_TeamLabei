import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <>
      <header className="home-header">
        <div className="header-inner">
          <div className="brand">MathMate</div>
          <nav className="main-nav">
            <Link to="/lessons">Curriculum</Link>
            <Link to="/ai-tutor">AI Tutor</Link>
            <Link to="/quizzes">Quizzes</Link>
          </nav>
          <div className="auth-actions">
            <Link to="/signin" className="login-link">Login</Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="home-page">
        <div className="home-container">
          <section className="home-hero">
            <div className="hero-left">
              <div className="eyebrow">AI-Powered Excellence for Grades 10-12</div>
              <h1 className="home-title">Master Math with AI Precision.</h1>
              <p className="home-subtitle">
                Personalized calculus learning powered by MathMate AI. From Grade 10 basics to Grade 12
                Advanced Calculus, we guide you every step of the way.
              </p>

              <div className="home-actions">
                <Link to="/signup">
                  <Button>Start Your Journey</Button>
                </Link>
                <Link to="#">
                  <Button variant="secondary">Watch Demo</Button>
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="image-card">
                <div className="robot-illustration">🤖</div>
              </div>
              <div className="score-badge">Score Boost <strong>+34% Avg</strong></div>
            </div>
          </section>

          <section className="metrics-row">
            <div className="stat">
              <div className="stat-value">50k+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat">
              <div className="stat-value">94%</div>
              <div className="stat-label">Improvement Rate</div>
            </div>
            <div className="stat">
              <div className="stat-value">200+</div>
              <div className="stat-label">Math Modules</div>
            </div>
          </section>

          <section className="features">
            <h2 className="section-heading">Precision Learning Tools</h2>
            <p className="section-sub">Our intelligent platform adapts to your unique learning style, identifying gaps in your knowledge before they become obstacles.</p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h4>AI-Powered Tutoring</h4>
                <p>24/7 instant problem solving. Upload a photo or type your equation for step-by-step guidance that explains the why, not just the what.</p>
                <a className="learn-more" href="#">Learn more →</a>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h4>Predictive Analytics</h4>
                <p>Visualize your progress with real-time mastery rings. Our AI predicts exam performance based on your daily practice habits.</p>
                <div className="feature-visual">
                  <div className="progress-circle">80%</div>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h4>Structured Curriculum</h4>
                <p>Exhaustive coverage from Algebra fundamentals to Advanced Calculus — organized into clear, grade-based modules.</p>
                <div className="curriculum-list">
                  <div className="curr-item">Grade 10 Algebra</div>
                  <div className="curr-item">Grade 11 Trigonometry</div>
                  <div className="curr-item disabled">Grade 12 Calculus</div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-banner">
            <div className="cta-inner">
              <h2>Ready to solve the unsolvable?</h2>
              <p>Join thousands of students who have turned math from a challenge into their strongest subject.</p>
              <div className="cta-actions">
                <Link to="/signup"><Button>Create Free Account</Button></Link>
                <Link to="/lessons"><Button variant="secondary">Explore Curriculum</Button></Link>
              </div>
            </div>
          </section>

          <footer className="home-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <div className="brand">MathMate</div>
                <p>© 2024 MathMate AI. Empowering the next generation of mathematicians.</p>
              </div>

              <div className="footer-links">
                <div className="col">
                  <h5>Platform</h5>
                  <a href="#">Curriculum</a>
                  <a href="#">AI Tutor</a>
                  <a href="#">Pricing</a>
                </div>
                <div className="col">
                  <h5>Company</h5>
                  <a href="#">About</a>
                  <a href="#">Contact</a>
                  <a href="#">Careers</a>
                </div>
                <div className="col">
                  <h5>Legal</h5>
                  <a href="#">Privacy</a>
                  <a href="#">Terms</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
