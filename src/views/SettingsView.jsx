import React, { useState, useEffect } from 'react';
import { User, Sliders, Palette, BrainCircuit, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { fetchIndianCities, getIndianCitiesSync } from '../api/cityService';

export const SettingsView = ({
  theme,
  setTheme,
  showDemoLabels,
  setShowDemoLabels,
  showAIExplanations,
  setShowAIExplanations,
  onShowToast
}) => {
  const [userName, setUserName] = useState("Alex Morgan");
  const [userEmail, setUserEmail] = useState("alex.morgan@proppulse.ai");
  const [currency, setCurrency] = useState("INR");
  const [defaultCity, setDefaultCity] = useState("Jaipur, Rajasthan");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [citiesList, setCitiesList] = useState(() => getIndianCitiesSync());

  useEffect(() => {
    let active = true;
    fetchIndianCities().then((cities) => {
      if (active && cities && cities.length > 0) {
        setCitiesList(cities);
      }
    });
    return () => { active = false; };
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast("Settings and profile saved successfully!", "success");
  };

  return (
    <div className="container-lg" style={{ paddingBottom: '4rem' }}>
      <div className="section-header">
        <span className="section-tag">Platform Configuration</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>Settings</h1>
        <p className="section-desc">
          Manage your valuation parameters, workspace appearance, and AI model configurations.
        </p>
      </div>

      {/* 1. Profile Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">
          <User size={20} color="var(--accent-blue)" /> Profile Information
        </h3>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>
              AM
            </div>
            <div>
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.35rem' }}>
                Change Avatar
              </button>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG or GIF. Max size 2MB</div>
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* 2. Preferences Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">
          <Sliders size={20} color="var(--accent-blue)" /> Valuation Preferences
        </h3>

        <div className="form-grid-2col">
          <div className="form-group">
            <label className="form-label">Valuation Currency</label>
            <select
              className="form-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">Indian Rupee (₹ INR / Lakhs / Crores)</option>
              <option value="USD">US Dollar ($ USD)</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Default Region / City</label>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} /> {citiesList.length} Cities
              </span>
            </div>
            <input
              type="text"
              list="settings-cities-list"
              className="form-input"
              value={defaultCity}
              onChange={(e) => setDefaultCity(e.target.value)}
              placeholder="e.g. Jaipur, Rajasthan"
            />
            <datalist id="settings-cities-list">
              {citiesList.map((c) => (
                <option key={c.fullName} value={c.fullName}>
                  {c.city} • {c.state}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        <label className="switch-label">
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Valuation Alerts & Notifications</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive notifications when micro-market rate indexes shift</div>
          </div>
          <input
            type="checkbox"
            className="switch-input"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </label>
      </div>

      {/* 3. Appearance Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">
          <Palette size={20} color="var(--accent-blue)" /> Appearance & Theme
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div
            className={`card ${theme === 'dark' ? 'card-interactive' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: theme === 'dark' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
            onClick={() => setTheme('dark')}
          >
            <Moon size={24} color="#38BDF8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dark Theme</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deep Navy & Near-Black</div>
          </div>

          <div
            className={`card ${theme === 'light' ? 'card-interactive' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: theme === 'light' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
            onClick={() => setTheme('light')}
          >
            <Sun size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Light Theme</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clean White & Slate</div>
          </div>

          <div
            className="card"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
            onClick={() => {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              setTheme(prefersDark ? 'dark' : 'light');
            }}
          >
            <Sliders size={24} color="var(--accent-violet)" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>System Auto</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Follow OS Setting</div>
          </div>
        </div>
      </div>

      {/* 4. AI Settings */}
      <div className="settings-section">
        <h3 className="settings-section-title">
          <BrainCircuit size={20} color="var(--accent-blue)" /> AI Model & Explainability Settings
        </h3>

        <label className="switch-label">
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Show Explainable AI (XAI) SHAP Weights</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Display feature contribution charts on prediction results</div>
          </div>
          <input
            type="checkbox"
            className="switch-input"
            checked={showAIExplanations}
            onChange={(e) => setShowAIExplanations(e.target.checked)}
          />
        </label>

        <label className="switch-label">
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Show Demonstration Badges</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Highlight simulated endpoints vs connected production microservices</div>
          </div>
          <input
            type="checkbox"
            className="switch-input"
            checked={showDemoLabels}
            onChange={(e) => setShowDemoLabels(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
};
