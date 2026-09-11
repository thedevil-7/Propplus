import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { Modal } from './components/common/Modal';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { PredictView } from './views/PredictView';
import { ThreeDView } from './views/ThreeDView';
import { Studio3DPlanView } from './views/Studio3DPlanView';
import { ComparisonView } from './views/ComparisonView';
import { SimilarView } from './views/SimilarView';
import { MarketInsightsView } from './views/MarketInsightsView';
import { HistoryView } from './views/HistoryView';
import { PropertyDetailView } from './views/PropertyDetailView';
import { SettingsView } from './views/SettingsView';

import { propertyService } from './api/propertyService';
import { DEMO_PROPERTIES, KPI_DATA } from './api/mockData';
import { Search, MapPin, ArrowRight, Settings as SettingsIcon, Sparkles, Box, Layout, Compass, TrendingUp, Building2, History } from 'lucide-react';

import './styles/index.css';
import './styles/components.css';

export function App() {
  // Navigation State & Active Scroll Section
  const [currentView, setCurrentView] = useState('landing');
  const [selectedProperty, setSelectedProperty] = useState(DEMO_PROPERTIES[0]);

  // Modals
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Theme Management (Light / Dark mode persisted)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('proppulse_theme') || 'dark';
  });

  // Settings & Toggles
  const [showDemoLabels, setShowDemoLabels] = useState(true);
  const [showAIExplanations, setShowAIExplanations] = useState(true);

  // Global Properties / History state
  const [propertiesList, setPropertiesList] = useState(DEMO_PROPERTIES);
  const [kpiData, setKpiData] = useState(KPI_DATA);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([
    { id: 1, type: 'info', message: 'Welcome to PropPulse Unified Platform — Single Page Experience!' }
  ]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('proppulse_theme', theme);
  }, [theme]);

  // Load initial history
  useEffect(() => {
    propertyService.getHistory().then((history) => {
      if (history?.length) {
        setPropertiesList(history);
      }
    });
  }, []);

  // Smooth scroll helper
  const scrollToSection = (sectionId) => {
    setCurrentView(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -76;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll spy with IntersectionObserver to update active navbar item as user scrolls
  useEffect(() => {
    const sections = ['landing', 'predict', 'floorplan', 'dashboard', 'threed', 'insights', 'properties', 'history'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentView(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Handlers
  const handleOpen3D = (prop) => {
    setSelectedProperty(prop);
    scrollToSection('floorplan');
  };

  const handleSelectProperty = (prop) => {
    setSelectedProperty(prop);
    setIsDetailOpen(true);
  };

  const handlePredictionComplete = (newProp) => {
    setPropertiesList((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
    showToast(`AI Valuation Complete: ₹${newProp.predictedValue} Lakhs`, 'success');
    setTimeout(() => {
      scrollToSection('floorplan');
    }, 450);
  };

  const handleDeleteHistoryRecord = async (id) => {
    const updated = await propertyService.deleteHistory(id);
    setPropertiesList(updated);
    showToast('Record deleted from prediction history.', 'info');
  };

  // Filtered search results
  const searchResults = propertiesList.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Global Sticky Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={scrollToSection}
        theme={theme}
        setTheme={setTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Single Page Scrollable Canvas */}
      <main className="main-content" style={{ overflowX: 'hidden' }}>
        {/* =================================================================
            SECTION 1: HERO & CORE LANDING EXPERIENCE (#landing)
            ================================================================= */}
        <section id="landing" className="page-scroll-section" style={{ paddingTop: '1rem' }}>
          <LandingView
            setCurrentView={scrollToSection}
            onSelectDemoProperty={handleSelectProperty}
          />
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 2: AI VALUATION ENGINE & PREDICTOR (#predict)
            ================================================================= */}
        <section id="predict" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={13} color="var(--accent-cyan)" /> 02 &bull; MACHINE LEARNING APPRAISAL
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  AI Property Valuation Engine
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Upload photos, specify structural amenities, and compute statistical micro-market price forecasts with explainable SHAP feature weights.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span className="badge badge-ai">XGBOOST V4.2 ACTIVE</span>
              </div>
            </div>

            <PredictView
              onPredictionComplete={handlePredictionComplete}
              onOpen3D={handleOpen3D}
              setCurrentView={scrollToSection}
            />
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 3: 3D & 2D SPATIAL STUDIO (#floorplan)
            ================================================================= */}
        <section id="floorplan" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Layout size={13} color="var(--accent-blue)" /> 03 &bull; ARCHITECTURAL DIGITAL TWIN
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  3D Interior &amp; Furnished Floor Plan Studio
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Explore 3D cutaway models, interactive 2D CAD blueprints, color-coded functional zoning, and real-time laser dimension measurement.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge badge-demo">2D &amp; 3D SYNCHRONIZED</span>
              </div>
            </div>

            <Studio3DPlanView
              property={selectedProperty}
              setCurrentView={scrollToSection}
              onShowToast={showToast}
            />
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 4: EXECUTIVE ANALYTICS DASHBOARD (#dashboard)
            ================================================================= */}
        <section id="dashboard" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Compass size={13} color="var(--accent-cyan)" /> 04 &bull; TELEMETRY &amp; KPIS
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  Executive Intelligence Dashboard
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Macro and micro-market portfolio telemetry, confidence intervals, price/sq.ft trajectories, and recent appraisal records.
                </p>
              </div>
            </div>

            <DashboardView
              kpiData={kpiData}
              properties={propertiesList}
              onSelectProperty={handleSelectProperty}
              onOpen3D={handleOpen3D}
              setCurrentView={scrollToSection}
            />
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 5: 3D HOUSE GEOMETRY EXPLORER (#threed)
            ================================================================= */}
        <section id="threed" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Box size={13} color="var(--accent-blue)" /> 05 &bull; SPATIAL COMPUTING
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  Interactive 3D Architectural Explorer
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Procedural Three.js WebGL rendering with live exterior stucco palette, roof geometry variants, landscaping, and camera presets.
                </p>
              </div>
            </div>

            <ThreeDView
              property={selectedProperty}
              setCurrentView={scrollToSection}
            />
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 6: MARKET INSIGHTS & REGIONAL BENCHMARKS (#insights)
            ================================================================= */}
        <section id="insights" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <TrendingUp size={13} color="var(--status-positive)" /> 06 &bull; REGIONAL MARKET DYNAMICS
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  Market Insights &amp; Price Forecasting
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Locality benchmarks across Jaipur, Jodhpur, and Kota. Price appreciation indices, quarterly rate curves, and SHAP pricing drivers.
                </p>
              </div>
            </div>

            <MarketInsightsView />
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 7: PROPERTY DISCOVERY & COMPARISONS (#properties)
            ================================================================= */}
        <section id="properties" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Building2 size={13} color="var(--accent-blue)" /> 07 &bull; COMPARATIVE MATRIX
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  Property Discovery &amp; Micro-Market Comparisons
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Benchmark similar assets side-by-side. Compare valuation spreads, price-per-square-foot ratios, and amenity score differentials.
                </p>
              </div>
            </div>

            <SimilarView
              onSelectProperty={handleSelectProperty}
              onOpen3D={handleOpen3D}
            />

            <div style={{ marginTop: '3rem' }}>
              <ComparisonView
                onOpen3D={handleOpen3D}
                onSelectProperty={handleSelectProperty}
              />
            </div>
          </div>
        </section>

        <div className="section-divider-line" />

        {/* =================================================================
            SECTION 8: PREDICTION HISTORY & REGISTRY ARCHIVE (#history)
            ================================================================= */}
        <section id="history" className="page-scroll-section">
          <div className="container-xl">
            <div className="section-header-banner">
              <div>
                <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <History size={13} color="var(--accent-cyan)" /> 08 &bull; REGISTRY AUDIT TRAIL
                </span>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', marginTop: '0.35rem' }}>
                  Prediction History &amp; Asset Ledger
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                  Permanent log of all computed valuations, input configurations, confidence scores, and historical registry appraisals.
                </p>
              </div>
            </div>

            <HistoryView
              history={propertiesList}
              onDeleteRecord={handleDeleteHistoryRecord}
              onSelectProperty={handleSelectProperty}
              setCurrentView={scrollToSection}
            />
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <Footer setCurrentView={scrollToSection} />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Properties & Locations"
      >
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Type property name, city (Jaipur, Jodhpur, Kota), or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {searchResults.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onClick={() => {
                setIsSearchOpen(false);
                handleSelectProperty(p);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={p.imageUrl} alt={p.title} style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {p.locality}, {p.location}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem' }}>₹{p.predictedValue}L</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.bedrooms} BHK</span>
              </div>
            </div>
          ))}
          {searchResults.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              No properties found matching "{searchQuery}".
            </p>
          )}
        </div>
      </Modal>

      {/* Property Details Modal / Slide-over (keeps single-page scroll intact!) */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Asset Intelligence Dossier"
        maxWidth="1140px"
      >
        <PropertyDetailView
          property={selectedProperty}
          onBack={() => setIsDetailOpen(false)}
          setCurrentView={(target) => {
            setIsDetailOpen(false);
            scrollToSection(target);
          }}
        />
      </Modal>

      {/* Preferences & Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Platform Preferences & Configurations"
        maxWidth="720px"
      >
        <SettingsView
          theme={theme}
          setTheme={setTheme}
          showDemoLabels={showDemoLabels}
          setShowDemoLabels={setShowDemoLabels}
          showAIExplanations={showAIExplanations}
          setShowAIExplanations={setShowAIExplanations}
          onShowToast={showToast}
        />
      </Modal>
    </div>
  );
}

export default App;
