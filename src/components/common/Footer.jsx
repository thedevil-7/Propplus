import React from 'react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer className="footer">
      <div className="container-xl footer-inner">
        <div>
          <div className="brand-logo" style={{ marginBottom: '0.5rem' }}>
            <div className="brand-icon-box" style={{ width: '30px', height: '30px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
              </svg>
            </div>
            <span>Prop<span className="brand-pulse-tag">Pulse</span></span>
          </div>
          <p style={{ fontSize: '0.85rem', maxWidth: '380px' }}>
            See It. Analyze It. Predict Its Value. Next-generation AI-powered real-estate valuation & 3D intelligence platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Navigation</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
              <li><button className="btn-ghost" onClick={() => setCurrentView('dashboard')}>Dashboard</button></li>
              <li><button className="btn-ghost" onClick={() => setCurrentView('predict')}>Valuation Model</button></li>
              <li><button className="btn-ghost" onClick={() => setCurrentView('threed')}>3D House Explorer</button></li>
              <li><button className="btn-ghost" onClick={() => setCurrentView('insights')}>Market Intelligence</button></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Platform</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
              <li><span className="badge badge-demo">DEMO MODE ACTIVE</span></li>
              <li style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.5rem' }}>Models: Gradient Boosting / XGBoost R² 89%</li>
              <li style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>REST API v1 Ready</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '2rem', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>&copy; {new Date().getFullYear()} PropPulse Inc. All rights reserved.</span>
        <span>Crafted for high-fidelity property intelligence & predictive analytics.</span>
      </div>
    </footer>
  );
};
