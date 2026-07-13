export default function AITutorPage() {
  return (
    <div className="page ai-tutor-page">
      <div className="tutor-header">
        <div className="tutor-status">
          <div className="status-dot"></div>
          AURA V2.4 ACTIVE
        </div>
        <div className="tutor-limit">
          <span>DAILY ASKING LIMIT</span>
          <div className="limit-bar">
            <div className="limit-fill" style={{ width: '70%' }}></div>
          </div>
          <span style={{ color: 'var(--color-primary)' }}>14/20</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-window">
          {/* AI Message */}
          <div className="chat-message chat-message--ai">
            <div className="chat-avatar ai">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
            </div>
            <div className="chat-bubble">
              <p>Hello! I&apos;m ready to help with your calculus session. You mentioned wanting to understand the <a href="#">Power Rule</a> for derivatives. It&apos;s one of the most fundamental tools in calculus!</p>
              <p>Essentially, if you have a function in the form:</p>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', margin: '16px 0', fontFamily: 'var(--mono)', fontWeight: '600', width: 'fit-content', marginInline: 'auto' }}>
                f(x) = x^n
              </div>
              <p>The derivative, denoted as <code style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>f&apos;(x)</code>, is calculated by bringing the exponent down as a multiplier and then subtracting one from the exponent:</p>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', margin: '16px 0', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                f&apos;(x) = n * x^(n-1)
              </div>
              <p>Would you like to try an example, like finding the derivative of <code style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>x^5</code>?</p>
            </div>
          </div>

          {/* User Message */}
          <div className="chat-message chat-message--user">
            <div className="chat-avatar user">
              <img src="https://ui-avatars.com/api/?name=Sokha&background=e2e8f0&color=475569" alt="User" className="avatar-img" />
            </div>
            <div className="chat-bubble">
              Yes, let&apos;s do x^5. And what happens if there is a number in front, like 3x^4?
            </div>
          </div>

          {/* AI Message with Step-by-Step Breakdown */}
          <div className="chat-message chat-message--ai">
            <div className="chat-avatar ai">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
            </div>
            <div className="chat-bubble" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '16px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg> Step-by-Step Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>1</div>
                  <div>For <code style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>x^5</code>, we identify <code style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>n = 5</code>. Following the rule: <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>5 * x^(5-1) = 5x^4</span>.</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>2</div>
                  <div>
                    <div style={{ marginBottom: '12px' }}>For <code style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>3x^4</code>, we use the Constant Multiple Rule alongside the Power Rule.</div>
                    <div style={{ padding: '16px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontStyle: 'italic' }}>
                      &quot;The constant just stays there and waits to be multiplied by the result of the derivative.&quot;
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>3</div>
                  <div>So, <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>d/dx(3x^4) = 3 * (4x^3) = 12x^3</span>.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="chat-input-wrapper">
          <form className="chat-input-form" onSubmit={(e) => e.preventDefault()}>
            <div className="chat-actions">
              <button type="button" className="chat-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </button>
              <button type="button" className="chat-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6H5a2 2 0 0 0-2 2v3"></path><path d="M18 18H5a2 2 0 0 1-2-2v-3"></path><path d="m14 14 4-4-4-4"></path></svg>
              </button>
              <button type="button" className="chat-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
              </button>
            </div>
            <input type="text" className="chat-input" placeholder="Ask a math problem or upload an equation..." />
            <button type="submit" className="chat-send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
