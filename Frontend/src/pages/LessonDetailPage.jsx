export default function LessonDetailPage() {
  return (
    <div className="lesson-detail" style={{display:'flex', gap:'40px', marginTop:'-40px', marginLeft:'-40px', marginRight:'-40px', padding:'40px'}}>
      <div className="lesson-sidebar" style={{width: '240px', borderRight: '1px solid var(--color-border)', paddingRight: '24px'}}>
         <h3 style={{color:'var(--color-primary)', fontSize:'16px', marginBottom:'16px'}}>Calculus I</h3>
         <div style={{display:'flex', flexDirection:'column', gap:'12px', fontSize:'14px'}}>
            <div style={{color:'var(--color-text-muted)'}}>Introduction to Limits</div>
            <div style={{color:'var(--color-text-muted)'}}>Limit Laws</div>
            <div style={{backgroundColor:'var(--color-primary)', color:'white', padding:'8px 12px', borderRadius:'var(--radius-md)', margin:'0 -12px'}}>Derivatives Intro</div>
            <div style={{color:'var(--color-text-muted)'}}>Basic Rules</div>
            <div style={{color:'var(--color-text-muted)'}}>Product & Quotient</div>
            <div style={{color:'var(--color-text-muted)'}}>Chain Rule</div>
            <div style={{color:'var(--color-text-muted)'}}>Applications</div>
            <div style={{color:'var(--color-text-muted)'}}>Practice Problems</div>
         </div>
      </div>
      <div className="lesson-content" style={{flex: 1, maxWidth: '800px'}}>
        <div style={{fontSize:'12px', color:'var(--color-text-muted)', marginBottom:'16px'}}>Calculus I &gt; Differentiation &gt; <b>Derivatives Complete Guide</b></div>
        <h1 style={{color:'var(--color-primary)', fontSize:'36px', marginBottom:'16px'}}>Derivatives: The Master Guide</h1>
        <p style={{fontSize:'16px', lineHeight:'1.6', marginBottom:'32px'}}>Welcome to the comprehensive guide on derivatives. From fundamental definitions to advanced application rules, this lesson covers everything you need to master differentiation.</p>
        
        <div className="lesson-block card" style={{backgroundColor:'var(--color-bg)', marginBottom:'32px'}}>
          <h3 style={{fontSize:'18px', display:'flex', alignItems:'center', gap:'8px'}}><span style={{color:'var(--color-primary)'}}>ⓘ</span> 1. Definition & Formal Limit</h3>
          <p style={{fontSize:'14px', marginBottom:'16px'}}>The derivative f&apos;(x) represents the instantaneous rate of change. Formally, it is the limit of the difference quotient as the interval approaches zero:</p>
          <div style={{backgroundColor:'var(--color-primary-light)', color:'var(--color-primary)', padding:'16px', borderRadius:'var(--radius-md)', textAlign:'center', fontFamily:'var(--mono)', fontWeight:'600'}}>
             f&apos;(x) = lim_(h → 0) [f(x+h) - f(x)] / h
          </div>
        </div>

        <div className="lesson-block card" style={{backgroundColor:'var(--color-bg)', marginBottom:'32px'}}>
           <h3 style={{fontSize:'18px', marginBottom:'16px'}}>2. Basic Derivative Rules</h3>
           <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div style={{backgroundColor:'white', padding:'16px', borderRadius:'var(--radius-sm)', border:'1px solid var(--color-border)'}}>
                 <h4 style={{margin:'0 0 8px 0', fontSize:'14px', color:'var(--color-primary)'}}>The Power Rule</h4>
                 <code style={{fontSize:'12px', backgroundColor:'var(--color-bg)', padding:'4px 8px', borderRadius:'4px'}}>d/dx [x^n] = n*x^(n-1)</code>
              </div>
              <div style={{backgroundColor:'white', padding:'16px', borderRadius:'var(--radius-sm)', border:'1px solid var(--color-border)'}}>
                 <h4 style={{margin:'0 0 8px 0', fontSize:'14px', color:'var(--color-primary)'}}>The Constant Rule</h4>
                 <code style={{fontSize:'12px', backgroundColor:'var(--color-bg)', padding:'4px 8px', borderRadius:'4px'}}>d/dx [c] = 0</code>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
