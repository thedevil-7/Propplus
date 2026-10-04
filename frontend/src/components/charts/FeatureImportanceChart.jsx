import React, { useState } from 'react';
import { FEATURE_IMPORTANCE } from '../../api/mockData';
import { HelpCircle, Sparkles } from 'lucide-react';

export const FeatureImportanceChart = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span className="section-tag">Explainable AI (XAI)</span>
          <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="var(--accent-blue)" /> Why did PropPulse predict this price?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Feature weight contributions (SHAP analysis) determining the final valuation.
          </p>
        </div>
        <span className="badge badge-demo">DEMO ML WEIGHTS</span>
      </div>

      <div className="feature-bars-container">
        {FEATURE_IMPORTANCE.map((item, idx) => {
          const isHovered = activeFeature === idx;
          return (
            <div
              key={idx}
              className="feature-bar-item"
              onMouseEnter={() => setActiveFeature(idx)}
              onMouseLeave={() => setActiveFeature(null)}
              style={{
                borderColor: isHovered ? 'var(--accent-blue)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="feature-header-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)' }}>
                  {item.feature}
                  <HelpCircle size={14} color="var(--text-muted)" />
                </span>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                  {item.importance}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${item.importance * 2.3}%`,
                    background: isHovered
                      ? 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))'
                      : 'linear-gradient(90deg, var(--accent-blue), var(--primary-500))'
                  }}
                />
              </div>

              {/* Dynamic Explanation */}
              <p className="feature-explanation-text">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
