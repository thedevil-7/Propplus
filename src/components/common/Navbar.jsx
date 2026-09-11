import React, { useState } from 'react';
import {
  Home,
  Compass,
  Sparkles,
  Building2,
  TrendingUp,
  History,
  Box,
  Layout,
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X,
  Settings
} from 'lucide-react';

export const Navbar = ({
  currentView,
  setCurrentView,
  theme,
  setTheme,
  onOpenSearch,
  unreadNotifications = 2
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'predict', label: 'Predict', icon: Sparkles },
    { id: 'floorplan', label: '3D & Floor Plan', icon: Layout },
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'threed', label: '3D Explorer', icon: Box },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'history', label: 'History', icon: History }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    const element = document.getElementById(viewId);
    if (element) {
      const yOffset = -76;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        <div className="container-xl navbar-inner">
          {/* Brand Logo */}
          <div
            className="brand-logo"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavClick('landing')}
          >
            <div className="brand-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
                <polyline points="8,13 10.5,10 13.5,16 16,13" stroke="var(--accent-blue)" strokeWidth="2" />
              </svg>
            </div>
            <span>Prop<span className="brand-pulse-tag">Pulse</span></span>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action Icons */}
          <div className="nav-actions">
            <button
              className="icon-button hide-mobile"
              onClick={onOpenSearch}
              title="Search Properties"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              className="icon-button hide-mobile"
              onClick={() => handleNavClick('settings')}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && <span className="notification-badge-dot" />}
            </button>

            <button
              className="icon-button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
            </button>

            <div
              className="user-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavClick('settings')}
              title="User Settings"
            >
              AI
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="icon-button menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-ai">PropPulse Mobile</span>
            <button className="icon-button" onClick={() => setMobileMenuOpen(false)}>
              <X size={18} />
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                style={{ width: '100%', padding: '0.85rem 1rem', justifyContent: 'flex-start' }}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span style={{ fontSize: '1rem' }}>{item.label}</span>
              </button>
            );
          })}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
            <button
              className="nav-link-btn"
              style={{ width: '100%', padding: '0.85rem 1rem', justifyContent: 'flex-start' }}
              onClick={() => handleNavClick('settings')}
            >
              <Settings size={18} />
              <span>Settings & Profile</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
