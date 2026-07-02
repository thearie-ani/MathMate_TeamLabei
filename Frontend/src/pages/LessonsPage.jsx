import { Link } from "react-router-dom";

export default function LessonsPage() {
  const lessons = [
    { id: 1, title: "Algebra", color: "bg-purple", icon: "∑", count: "24 Lessons • 8 Modules", progress: 65, colorCode: "var(--color-primary)" },
    { id: 2, title: "Calculus", color: "bg-orange", icon: "⚟", count: "18 Lessons • 5 Modules", progress: 12, colorCode: "#c2410c" },
    { id: 3, title: "Geometry", color: "bg-blue", icon: "△", count: "32 Lessons • 10 Modules", progress: 40, colorCode: "#1d4ed8" },
    { id: 4, title: "Functions", color: "bg-red", icon: "📈", count: "15 Lessons • 4 Modules", progress: 88, colorCode: "#b91c1c" },
  ];

  const formulas = [
    { title: "Pythagorean Theorem", math: "a² + b² = c²", icon: "📐" },
    { title: "Area of a Circle", math: "A = πr²", icon: "⭕" },
    { title: "Quadratic Formula", math: "x = (-b ± √(b² - 4ac)) / 2a", icon: "🧮" },
  ];

  return (
    <div className="page lessons-page">
      <div className="lessons-header">
        <h1 className="page-title" style={{marginBottom: '8px'}}>Lessons Explorer</h1>
        <p className="lessons-subtitle">Curated paths to master Grade 11 Mathematics with precision and clarity.</p>
        
        <div className="grade-filters">
          <button className="grade-pill">Grade 10</button>
          <button className="grade-pill active">Grade 11</button>
          <button className="grade-pill">Grade 12</button>
        </div>
      </div>
      
      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <Link to={`/lessons/${lesson.id}`} key={lesson.id} className="lesson-card card">
            <div className={`lesson-icon-wrapper ${lesson.color}`}>
              {lesson.icon}
            </div>
            <h3>{lesson.title}</h3>
            <p className="lesson-meta">{lesson.count}</p>
            
            <div className="lesson-progress-header">
              <span style={{color: lesson.colorCode}}>PROGRESS</span>
              <span>{lesson.progress}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-track" style={{height: '4px'}}>
                 <div className="progress-fill" style={{width: `${lesson.progress}%`, backgroundColor: lesson.colorCode}}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="formula-section">
        <div className="formula-header">
          <div>
            <h2 className="section-title" style={{marginBottom: '8px'}}>Formula Library</h2>
            <p style={{color: 'var(--color-text-muted)', fontSize: '15px'}}>Instant access to theorem proofs and mathematical constants.</p>
          </div>
          <div style={{position: 'relative'}}>
            <span style={{position:'absolute', left:'12px', top:'12px', color:'var(--color-text-muted)'}}>🔍</span>
            <input type="text" className="formula-search" placeholder="Search formulas..." />
          </div>
        </div>
        
        <div className="formula-grid">
          {formulas.map((f, i) => (
            <div key={i} className="formula-card card">
              <div className="formula-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <div className="formula-math">{f.math}</div>
              </div>
            </div>
          ))}
          <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
             <button className="btn btn-secondary" style={{borderRadius:'var(--radius-full)'}}>Browse All 200+ Formulas →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
