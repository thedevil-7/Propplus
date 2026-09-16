import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Box,
  Brain,
  Layers,
  LineChart as LineChartIcon,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building,
  Activity,
  Maximize2,
  TrendingUp,
  Sliders,
  Check,
  Search,
  Zap,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';

export const LandingView = ({ setCurrentView, onSelectDemoProperty }) => {
  // Quick Estimator State
  const [estCity, setEstCity] = useState('jaipur');
  const [estLocality, setEstLocality] = useState('Vaishali Nagar, Sector 4');
  const [estConfig, setEstConfig] = useState('3bhk');
  const [estArea, setEstArea] = useState('1,850');
  const [quickCalcResult, setQuickCalcResult] = useState(null);

  // 3D Viewport interactive presets & hotspot
  const [cameraPreset, setCameraPreset] = useState('front');
  const [hotspotActive, setHotspotActive] = useState(false);

  const handleQuickEstimate = (e) => {
    e.preventDefault();
    const areaNum = parseFloat(estArea.replace(/,/g, '')) || 1850;
    let baseRate = 7200;
    if (estCity === 'jodhpur') baseRate = 5800;
    else if (estCity === 'kota') baseRate = 4600;
    else if (estCity === 'udaipur') baseRate = 6400;
    else if (estCity === 'mumbai') baseRate = 22000;
    else if (estCity === 'delhi') baseRate = 12500;
    else if (estCity === 'bengaluru') baseRate = 9800;
    else if (estCity === 'hyderabad') baseRate = 8400;
    else if (estCity === 'pune') baseRate = 7800;
    else if (estCity === 'chennai') baseRate = 7400;
    else if (estCity === 'ahmedabad') baseRate = 5800;

    const totalVal = Math.round((areaNum * baseRate) / 100000); // in Lakhs
    const inCr = (totalVal / 100).toFixed(2);
    setQuickCalcResult({
      valueCr: inCr,
      rateSqft: baseRate,
      confidence: '91.4%',
      city: estCity.toUpperCase(),
      area: areaNum
    });
  };

  const compsData = [
    {
      id: 'comp-1',
      title: 'Villa Serena #08',
      market: 'Vaishali Nagar, Jaipur',
      config: '3 BHK • 1,850 sq.ft',
      price: '₹1,35,00,000',
      priceTag: '₹1.35 Cr',
      rate: '₹7,297 / sq.ft',
      confidence: '94% High',
      type: 'villa'
    },
    {
      id: 'comp-2',
      title: 'The Skywards Residences',
      market: 'Malviya Nagar, Jaipur',
      config: '4 BHK • 2,420 sq.ft',
      price: '₹2,18,00,000',
      priceTag: '₹2.18 Cr',
      rate: '₹9,008 / sq.ft',
      confidence: '91% High',
      type: 'apartment'
    },
    {
      id: 'comp-3',
      title: 'C-Scheme Heritage Penthouse',
      market: 'C-Scheme, Jaipur',
      config: '3 BHK • 2,100 sq.ft',
      price: '₹2,95,00,000',
      priceTag: '₹2.95 Cr',
      rate: '₹14,047 / sq.ft',
      confidence: '88% Solid',
      type: 'penthouse'
    },
    {
      id: 'comp-4',
      title: 'Mansarovar Green Villa',
      market: 'Mansarovar Ext, Jaipur',
      config: '3 BHK • 1,600 sq.ft',
      price: '₹98,50,000',
      priceTag: '₹98.5 L',
      rate: '₹6,156 / sq.ft',
      confidence: '96% High',
      type: 'villa'
    },
    {
      id: 'comp-5',
      title: 'Shastri Nagar Royal Estate',
      market: 'Shastri Nagar, Jodhpur',
      config: '4 BHK • 2,800 sq.ft',
      price: '₹1,65,00,000',
      priceTag: '₹1.65 Cr',
      rate: '₹5,892 / sq.ft',
      confidence: '92% High',
      type: 'villa'
    },
    {
      id: 'comp-6',
      title: 'Talwandi Prime Residency',
      market: 'Talwandi, Kota',
      config: '3 BHK • 1,750 sq.ft',
      price: '₹82,00,000',
      priceTag: '₹82.0 L',
      rate: '₹4,685 / sq.ft',
      confidence: '95% High',
      type: 'apartment'
    }
  ];

  return (
    <div className="landing-page-wrap" style={{ paddingBottom: '3rem' }}>
      {/* ------------------------------------------------------------------
          1. IMMERSIVE HERO SECTION
          ------------------------------------------------------------------ */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container-xl" style={{ position: 'relative', zIndex: 2 }}>
          {/* Tagline & Live Engine Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="stitch-pill-live">
              <span className="pulsing-beacon" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-positive)', display: 'inline-block' }}></span>
              <span style={{ color: 'var(--status-positive)' }}>PropPulse Neural Engine v4.2 Active</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'none', fontWeight: 500 }}>See It. Analyze It. Predict Its Value.</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="var(--accent-blue)" />
              <span>48,290+ Registry Comps Processed This Week</span>
            </div>
          </div>

          {/* Hero Header & Value Proposition Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.9fr)', gap: '2.5rem', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="hero-title" style={{ fontSize: '3.4rem', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                AI-Powered Property Valuation &amp; <br />
                <span className="text-gradient">3D Spatial Intelligence</span>
              </h1>

              <p className="hero-desc" style={{ fontSize: '1.12rem', maxWidth: '640px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                Upload your property specs, explore photorealistic 3D architectural digital twins, benchmark micro-market ₹/sq.ft transactions, and forecast institutional-grade valuations with gradient boosted ML.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.85rem', width: '100%', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: '1 1 200px' }}
                  onClick={() => setCurrentView('predict')}
                >
                  <Sparkles size={18} />
                  <span>Analyze My Property</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => setCurrentView('threed')}
                >
                  <Box size={18} color="var(--accent-cyan)" />
                  <span>Explore 3D Studio</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Zap size={14} color="var(--status-positive)" />
                <span>Zero paperwork required • Instant sub-second inference</span>
              </div>
            </div>
          </div>

          {/* Quick Interactive Estimator Bar (Stitch Inspiration) */}
          <div className="quick-estimator-wrap">
            <form className="quick-estimator-form" onSubmit={handleQuickEstimate}>
              <div className="quick-field-group">
                <label className="quick-field-label">Metro Market / City</label>
                <div className="quick-input-box">
                  <MapPin size={16} color="var(--accent-blue)" />
                  <select value={estCity} onChange={(e) => setEstCity(e.target.value)}>
                    <option value="jaipur">Jaipur (Pink City Sub-markets)</option>
                    <option value="jodhpur">Jodhpur (Sun City Heritage)</option>
                    <option value="kota">Kota (Chambal Education Hub)</option>
                    <option value="udaipur">Udaipur (Lake City Luxury)</option>
                    <option value="mumbai">Mumbai MMR</option>
                    <option value="bengaluru">Bengaluru Tech Hubs</option>
                    <option value="delhi">Delhi NCR / Gurugram</option>
                    <option value="hyderabad">Hyderabad (HITEC & Financial Dist)</option>
                    <option value="pune">Pune (IT Corridor & West)</option>
                    <option value="chennai">Chennai (OMR Corridor)</option>
                    <option value="ahmedabad">Ahmedabad (SG Highway)</option>
                  </select>
                </div>
              </div>

              <div className="quick-field-group">
                <label className="quick-field-label">Micro Locality / Sector</label>
                <div className="quick-input-box">
                  <Building size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    value={estLocality}
                    onChange={(e) => setEstLocality(e.target.value)}
                    placeholder="e.g. Vaishali Nagar, Shastri Nagar..."
                  />
                </div>
              </div>

              <div className="quick-field-group">
                <label className="quick-field-label">Configuration</label>
                <div className="quick-input-box">
                  <Layers size={16} color="var(--text-muted)" />
                  <select value={estConfig} onChange={(e) => setEstConfig(e.target.value)}>
                    <option value="3bhk">3 BHK Luxury Sky-Villa</option>
                    <option value="4bhk">4 BHK Penthouse / Villa</option>
                    <option value="2bhk">2 BHK Compact Residence</option>
                    <option value="plot">Gated Freehold Plot</option>
                  </select>
                </div>
              </div>

              <div className="quick-field-group">
                <label className="quick-field-label">Super Built-up Area</label>
                <div className="quick-input-box">
                  <input
                    type="text"
                    value={estArea}
                    onChange={(e) => setEstArea(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SQ.FT</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
                <Sparkles size={16} />
                <span>Predict Value</span>
              </button>
            </form>

            {/* Quick feedback drop indicator */}
            {quickCalcResult && (
              <div className="quick-feedback-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} color="var(--status-positive)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Algorithmic Model Calibrated: Estimated Base <strong style={{ color: 'var(--status-positive)', fontSize: '1.05rem' }}>₹{quickCalcResult.valueCr} Cr</strong> (Confidence {quickCalcResult.confidence})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    Historical rate: ₹{quickCalcResult.rateSqft.toLocaleString()}/sq.ft avg
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCurrentView('predict')}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    <span>Launch Full Valuation Engine</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------
              MAIN VISUAL HERO VIEWPORT (3D Digital Twin with Telemetry Overlays)
              ------------------------------------------------------------------ */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}>
            {/* 3D Viewport Top HUD Bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(14, 19, 33, 0.95) 0%, rgba(14, 19, 33, 0) 100%)',
              pointerEvents: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', pointerEvents: 'auto' }}>
                <span className="stitch-pill-live">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                  <span>3D DIGITAL TWIN #PP-8402</span>
                </span>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--status-positive)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}>
                  VERIFIED SAMPLE TELEMETRY
                </span>
              </div>

              {/* Camera Angle Quick Navigators */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                padding: '0.25rem',
                borderRadius: 'var(--radius-md)',
                pointerEvents: 'auto'
              }}>
                <button
                  className={`btn btn-sm ${cameraPreset === 'front' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                  onClick={() => setCameraPreset('front')}
                >
                  <span>Twilight Orbit</span>
                </button>
                <button
                  className={`btn btn-sm ${cameraPreset === 'top' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                  onClick={() => setCameraPreset('top')}
                >
                  <span>Solar Path</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                  onClick={() => setCurrentView('floorplan')}
                >
                  <span>Floorplan Cut</span>
                </button>
              </div>
            </div>

            {/* Interactive 3D WebGL Canvas */}
            <ThreeDViewer height="560px" isHero={true} />

            {/* Interactive Hotspot Node in 3D Space */}
            <div
              style={{
                position: 'absolute',
                top: '42%',
                left: '46%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                cursor: 'pointer'
              }}
              onClick={() => setHotspotActive(!hotspotActive)}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="pulsing-beacon" style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.4)' }}></span>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  color: '#0A0F1D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)'
                }}>
                  +
                </div>

                {/* Hotspot Hover Card */}
                {hotspotActive && (
                  <div style={{
                    position: 'absolute',
                    left: '34px',
                    top: '-10px',
                    width: '240px',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
                    zIndex: 40
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>Infinity Deck &amp; Cantilever</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Adds +6.4% micro-valuation premium over standard hillside lots.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Telemetry HUD Data Grid Overlays (Stitch Inspiration) */}
            <div className="telemetry-hud-overlay">
              {/* Card 1: Fair Value Estimate */}
              <div className="telemetry-hud-card">
                <div className="telemetry-hud-header">
                  <span className="telemetry-title">PropPulse Fair Value</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--status-positive)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <TrendingUp size={11} /> +4.2% Alpha
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.25rem 0' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>₹1.35</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Crore</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>(₹1,35,00,000)</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden', margin: '0.5rem 0' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--primary-500), var(--status-positive))' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Range: ₹1.27 Cr — ₹1.42 Cr</span>
                  <span style={{ color: 'var(--status-positive)', fontWeight: 600 }}>R² 0.89 High</span>
                </div>
              </div>

              {/* Card 2: Unit Specs */}
              <div className="telemetry-hud-card">
                <div className="telemetry-hud-header">
                  <span className="telemetry-title">Unit Specifications</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: RAJ-JP-0931</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', margin: '0.25rem 0' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>TYPOLOGY</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>3 BHK Cascading</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>SUPER BUILT-UP</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>1,800 sq.ft</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>BENCHMARK RATE</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>₹7,500 / sq.ft</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>ORIENTATION</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>South-West</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--status-positive)', marginTop: '0.25rem' }}>
                  <CheckCircle2 size={13} />
                  <span>Title Deed Clean • RERA Verified</span>
                </div>
              </div>

              {/* Card 3: Model Stack */}
              <div className="telemetry-hud-card">
                <div className="telemetry-hud-header">
                  <span className="telemetry-title">Predictive Model Stack</span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Core Estimator:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>XGBoost v3 Regression</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Neighborhood Comps:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>24 Mapped</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Registry Ingestion:</span>
                    <span style={{ color: 'var(--text-muted)' }}>18 Mins Ago</span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.45rem', fontSize: '0.75rem', padding: '0.35rem' }}
                  onClick={() => setCurrentView('predict')}
                >
                  <span>INSPECT VALUATION BREAKDOWN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. 4 KEY VALUE PILLARS (BENTO GRID - STITCH INSPIRATION)
          ------------------------------------------------------------------ */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container-xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Institutional Precision</span>
              <h2 style={{ fontSize: '2.4rem', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                Architectural Rigor Meets Quantitative Finance
              </h2>
            </div>
            <p style={{ maxWidth: '440px', color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.6 }}>
              PropPulse replaces outdated rule-of-thumb broker quotes with hyper-local geospatial telemetry, computer vision, and machine learning.
            </p>
          </div>

          <div className="bento-grid-4">
            {/* Pillar 1 */}
            <div className="bento-card">
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Brain size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Machine Learning Core</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.65rem' }}>AI Property Valuation</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Trained on government registry deeds, circle rates, and hyper-local historical transactions to deliver accurate confidence bands.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem', color: 'var(--status-positive)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>±3.1% Median Variance</span>
                <TrendingUp size={15} />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bento-card">
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Box size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spatial Digital Twins</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.65rem' }}>Realistic 3D Architecture</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Interactive walkthroughs with solar orientation simulations, cross-sectional floor plates, and structural materiality inspection.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>60 FPS WebGL Rendering</span>
                <Sliders size={15} />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bento-card">
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--status-positive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <LineChartIcon size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--status-positive)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hyperlocal Comps</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.65rem' }}>Micro-Market Benchmarking</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Compare your asset directly against 24+ identical micro-neighborhood comps within a strict 500-meter geographic buffer.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>500m Geographic Radii</span>
                <MapPin size={15} />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bento-card">
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strategic Allocation</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.65rem' }}>Budget Match Engine</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Discover verified high-yield opportunities tailored to your exact crore or lakh investment threshold with yield projections.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem', color: '#a78bfa', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>12.8% Target IRR Matches</span>
                <Activity size={15} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. EXECUTION PROTOCOL PIPELINE (01 -> 04)
          ------------------------------------------------------------------ */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-surface-elevated)' }}>
        <div className="container-xl">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="section-tag">Execution Protocol</span>
            <h2 style={{ fontSize: '2.4rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              From Property Specs to Predictive Intelligence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>
              A streamlined 4-step sequence designed for home owners, institutional funds, and real estate advisors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Step 01 */}
            <div className="protocol-step-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="protocol-step-num">01</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <Building size={18} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Register &amp; Profile</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Create your profile or sign in as an individual owner. Define investor criteria and target cities.
                </p>
              </div>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={13} color="var(--status-positive)" />
                <span>Instant 2-Factor Sign-in</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="protocol-step-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="protocol-step-num">02</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                  <Layers size={18} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Submit Specs &amp; Plans</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Enter floor dimensions, structural age, bedroom configs, elevation shots, or architectural CAD drawings.
                </p>
              </div>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={13} color="var(--accent-blue)" />
                <span>PDF / BIM / CAD Ready</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="protocol-step-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="protocol-step-num">03</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-positive)' }}>
                  <Brain size={18} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Neural Engine Compute</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Algorithmic synthesis across local ₹/sq.ft transactions, infra development indices, and circle rate deviations.
                </p>
              </div>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={13} color="var(--status-positive)" />
                <span>Ingestion Speed: &lt;1.2 Sec</span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="protocol-step-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="protocol-step-num">04</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Unlock Valuation &amp; 3D</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Export RERA-compliant valuation sheets, interact with 3D digital twins, and connect with certified listing partners.
                </p>
              </div>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={13} color="var(--accent-cyan)" />
                <span>RERA Compliant Dossier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. LIVE NEIGHBORHOOD COMPS PREVIEW (JAIPUR, JODHPUR, KOTA)
          ------------------------------------------------------------------ */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container-xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Live Rajasthan &amp; Metro Telemetry</span>
              <h2 style={{ fontSize: '2.4rem', letterSpacing: '-0.02em' }}>Recent Algorithmic Comps Benchmarked</h2>
            </div>

            <div className="stitch-pill-live">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-positive)', display: 'inline-block' }}></span>
              <span>Feed Live: 14 New Comps Today</span>
            </div>
          </div>

          <div className="comps-table-container">
            <table className="comps-table">
              <thead>
                <tr>
                  <th>Property Reference</th>
                  <th>Micro-Market</th>
                  <th>Config &amp; Area</th>
                  <th>PropPulse Valuation</th>
                  <th>Benchmark Rate</th>
                  <th>Model Confidence</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {compsData.map((comp) => (
                  <tr key={comp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Building size={16} color="var(--accent-cyan)" />
                        <span>{comp.title}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{comp.market}</td>
                    <td style={{ color: 'var(--text-primary)' }}>{comp.config}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{comp.price} </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--status-positive)', fontWeight: 600 }}>({comp.priceTag})</span>
                    </td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{comp.rate}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: 'var(--status-positive)',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}>
                        {comp.confidence}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                        onClick={() => setCurrentView('threed')}
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. CTA BANNER SECTION
          ------------------------------------------------------------------ */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container-xl">
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, rgba(30, 41, 59, 0.9) 100%)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.45)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '580px', position: 'relative', zIndex: 2 }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                Instant Online Analysis
              </span>
              <h3 style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Ready to Decode Your Property's Fair Value?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                Upload floor configurations, specify hyper-local landmarks, and generate instant institutional-grade valuations in under 60 seconds.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setCurrentView('predict')}
                style={{ padding: '0.9rem 2rem' }}
              >
                <Sparkles size={18} />
                <span>Start Instant Valuation</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. INSTITUTIONAL TRUST & LEGAL NOTICE
          ------------------------------------------------------------------ */}
      <section style={{ padding: '1.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', maxWidth: '750px' }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              <strong>Institutional Notice:</strong> PropPulse predictions are algorithmic estimates derived from statistical ML regression (XGBoost, LightGBM) and historical land registry records. This calculation does not constitute a certified bank appraisal, tax deed, or formal legal assessment under Indian Stamp Acts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            <span>ISO 27001 SECURED</span>
            <span>•</span>
            <span>RERA BENCHMARK ALIGNED</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
