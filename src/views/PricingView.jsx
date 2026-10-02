import React from 'react';
import { Check, X, Sparkles, Database, Shield, Zap } from 'lucide-react';

export const PricingView = ({ userRole, setUserRole, setCurrentView }) => {
  const isPremium = userRole === 'customer_premium' || userRole === 'admin';

  const handleUpgrade = () => {
    setUserRole('customer_premium');
    setCurrentView('predict');
  };

  const handleDowngrade = () => {
    setUserRole('customer_free');
    setCurrentView('predict');
  };

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Unlock Real Estate <span style={{ color: 'var(--accent-blue)' }}>Intelligence</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Choose the right plan to access advanced AI property valuations, market comparables, and historical price data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* FREE PLAN */}
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Free</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>
            Basic property estimates for casual buyers and sellers.
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text-primary)' }}>
            ₹0 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ forever</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--status-positive)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Basic AI Valuation Estimate</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--status-positive)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>General Market Averages</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
              <X size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>No Real-time Comparable Data</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
              <X size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>No Historical Price Trends</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
              <X size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Broad Valuation Margins</span>
            </li>
          </ul>

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={!isPremium && userRole === 'customer_free'}
            onClick={handleDowngrade}
          >
            {!isPremium ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="card" style={{ padding: '2.5rem', border: '2px solid var(--accent-blue)', position: 'relative', background: 'var(--bg-surface-elevated)' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-blue)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(65, 105, 225, 0.3)' }}>
            <Sparkles size={14} /> RECOMMENDED
          </div>
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Premium</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>
            Data-driven precision for serious investors and agents.
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text-primary)' }}>
            ₹999 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ month</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontWeight: 600 }}>High-Precision AI Valuation</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Full Market Comparables (Live)</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>3-Year Price History Data</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Tight Valuation Confidence Bands</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Check size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Detailed Feature Importance Analysis</span>
            </li>
          </ul>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isPremium}
            onClick={handleUpgrade}
          >
            {isPremium ? 'Currently Active' : 'Upgrade to Premium'}
          </button>
        </div>

      </div>
    </div>
  );
};
