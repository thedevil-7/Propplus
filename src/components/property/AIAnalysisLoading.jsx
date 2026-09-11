import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const AIAnalysisLoading = ({ onComplete }) => {
  const steps = [
    "Analyzing property photos & architectural facade",
    "Extracting structural features & detected amenities",
    "Evaluating micro-market location & transit proximity",
    "Comparing local market patterns & historical transactions",
    "Generating AI price valuation & confidence intervals"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="ai-loading-container">
      {/* Neural Scanner Graphic */}
      <div className="neural-scanner-circle">
        <Sparkles size={38} color="var(--accent-blue)" />
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Analyzing Your Property</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem' }}>
        PropPulse is combining your property details, visual information, and market patterns.
      </p>

      {/* 5-Step Pipeline */}
      <div className="steps-pipeline">
        {steps.map((text, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div
              key={idx}
              className={`step-row ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-dot">
                {isDone ? (
                  <CheckCircle2 size={16} color="var(--status-positive)" />
                ) : isActive ? (
                  <Loader2 size={16} className="spin" color="var(--accent-blue)" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
