import StatCard from "../features/dashboard/StatCard";

export default function DashboardPage() {
  const stats = [
    { label: "DAILY STREAK", value: "12 Days", icon: "🔥", type: "streak" },
    { label: "XP PROGRESS", value: "2,450 XP", icon: "★", type: "xp" },
    { label: "WEEKLY RANK", value: "#4 Silver", icon: "📊", type: "rank" },
  ];

  return (
    <div className="page dashboard-page">
      <div className="dashboard-grid">
        <div className="hero-card">
          <div className="hero-decoration">✨</div>
          <h1 className="hero-title">Good morning, Sokha! 👋</h1>
          <p className="hero-desc">You&apos;re on a 12-day streak! Complete today&apos;s calculus practice to reach your weekly goal.</p>
          <button className="btn btn-primary">Start Daily Challenge</button>
        </div>
        <div className="stat-column">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </div>
      
      <div className="dashboard-bottom-grid">
        <div className="bottom-left-col">
          <div className="perf-card" style={{ marginBottom: '24px' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h2 className="section-title">Performance Analytics</h2>
              <div>
                <span className="badge badge-info">Weekly</span> <span style={{fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', marginLeft:'12px'}}>Monthly</span>
              </div>
            </div>
            <p style={{color:'var(--color-text-muted)', marginTop:'-16px', marginBottom:'24px', fontSize:'14px'}}>Your problem-solving accuracy over the last 7 days</p>
            <div style={{height: '200px', display:'flex', alignItems:'flex-end', justifyContent:'space-around', borderBottom:'1px solid var(--color-border)', paddingBottom:'16px'}}>
               {/* Dummy chart lines */}
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Mon</div>
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Tue</div>
               <div style={{fontSize:'12px', color:'var(--color-primary)', fontWeight:'600'}}>Wed</div>
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Thu</div>
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Fri</div>
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Sat</div>
               <div style={{fontSize:'12px', color:'var(--color-text-muted)'}}>Sun</div>
            </div>
            <div style={{display:'flex', marginTop:'24px', gap:'80px', justifyContent:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'var(--color-text-muted)', marginBottom:'4px'}}>ACCURACY</div>
                <div style={{fontSize:'24px', fontWeight:'700'}}>88.4% <span style={{fontSize:'14px', color:'var(--color-success)'}}>↑ 2%</span></div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'var(--color-text-muted)', marginBottom:'4px'}}>AVG. SPEED</div>
                <div style={{fontSize:'24px', fontWeight:'700'}}>42s <span style={{fontSize:'14px', color:'var(--color-text-muted)', fontWeight:'normal'}}>/ problem</span></div>
              </div>
            </div>
          </div>
          
          <h2 className="section-title">Continue Learning</h2>
          <div style={{display:'flex', gap:'16px'}}>
             <div className="continue-card" style={{flex:1}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
                  <div className="lesson-icon-wrapper bg-purple" style={{margin:0}}>∑</div>
                  <span style={{fontSize:'12px', fontWeight:'600'}}>80% Complete</span>
                </div>
                <h4 style={{margin:'0 0 8px 0', fontSize:'16px'}}>Advanced Derivatives II</h4>
                <p style={{fontSize:'13px', color:'var(--color-text-muted)', margin:'0 0 24px 0'}}>Mastering chain rules and implicit differentiation.</p>
                <div className="progress-bar-wrapper">
                  <div className="progress-track">
                     <div className="progress-fill" style={{width: '80%'}}></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{width:'100%', marginTop:'24px'}}>Continue →</button>
             </div>
             <div className="continue-card" style={{flex:1}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
                  <div className="lesson-icon-wrapper bg-orange" style={{margin:0}}>⚟</div>
                  <span style={{fontSize:'12px', fontWeight:'600'}}>15% Complete</span>
                </div>
                <h4 style={{margin:'0 0 8px 0', fontSize:'16px'}}>Introduction to Integrals</h4>
                <p style={{fontSize:'13px', color:'var(--color-text-muted)', margin:'0 0 24px 0'}}>The fundamental theorem of calculus and area under curves.</p>
                <div className="progress-bar-wrapper">
                  <div className="progress-track">
                     <div className="progress-fill" style={{width: '15%', backgroundColor:'#c2410c'}}></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{width:'100%', marginTop:'24px'}}>Resume ↺</button>
             </div>
          </div>
        </div>
        
        <div className="bottom-right-col" style={{display:'flex', flexDirection:'column', gap:'24px'}}>
          <div className="skills-card">
            <h2 className="section-title" style={{marginBottom:'32px'}}>Skill Mastery</h2>
            <div className="skills-list">
               <div className="skill-item">
                 <div className="skill-circle">80%</div>
                 <div className="skill-info">
                   <h4>Calculus</h4>
                   <p>Mastery level: Advanced</p>
                 </div>
               </div>
               <div className="skill-item">
                 <div className="skill-circle" style={{borderColor:'#3b82f6'}}>40%</div>
                 <div className="skill-info">
                   <h4>Algebra</h4>
                   <p>Mastery level: Intermediate</p>
                 </div>
               </div>
               <div className="skill-item">
                 <div className="skill-circle" style={{borderColor:'#4338ca'}}>65%</div>
                 <div className="skill-info">
                   <h4>Geometry</h4>
                   <p>Mastery level: Proficient</p>
                 </div>
               </div>
               <div className="skill-item">
                 <div className="skill-circle" style={{borderColor:'#10b981'}}>90%</div>
                 <div className="skill-info">
                   <h4>Statistics</h4>
                   <p>Mastery level: Expert</p>
                 </div>
               </div>
            </div>
            <button className="btn btn-secondary" style={{width:'100%', marginTop:'32px'}}>View Detailed Breakdown</button>
          </div>
          
          <div className="actions-card" style={{backgroundColor: 'transparent', border:'none', boxShadow:'none', padding:0}}>
            <h2 className="section-title">Quick Actions</h2>
            <button className="quick-action-btn">
              <div className="qa-left"><span className="qa-icon">🤖</span> Ask AI Tutor</div>
              <span>→</span>
            </button>
            <button className="quick-action-btn">
              <div className="qa-left"><span className="qa-icon">⏱️</span> Resume Last Quiz</div>
              <span>→</span>
            </button>
            <button className="quick-action-btn">
              <div className="qa-left"><span className="qa-icon">💬</span> Study Community</div>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
