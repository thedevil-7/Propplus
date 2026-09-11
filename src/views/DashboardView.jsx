import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Download,
  PhoneCall,
  Sliders,
  Activity,
  Box
} from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';

export const DashboardView = ({
  kpiData,
  properties = [],
  onSelectProperty,
  onOpen3D,
  setCurrentView
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const recentProps = properties.slice(0, 4);

  const miniTrendData = [
    { period: 'Jan', rate: 3750 },
    { period: 'Mar', rate: 3820 },
    { period: 'May', rate: 3900 },
    { period: 'Jul', rate: 3960 },
    { period: 'Sep', rate: 4028 }
  ];

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      {/* ------------------------------------------------------------------
          1. SUB-NAV / MODE SWITCHER BAR (STITCH INSPIRATION)
          ------------------------------------------------------------------ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem'
      }}>
        {/* Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.95rem' }}
            onClick={() => setActiveTab('overview')}
          >
            <Sparkles size={14} />
            <span>Unified Overview</span>
            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.2)', marginLeft: '4px' }}>LIVE</span>
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'valuation' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.95rem' }}
            onClick={() => setCurrentView('predict')}
          >
            <span>AI Valuation &amp; Explainability</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700, marginLeft: '4px' }}>₹1.35 Cr</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.95rem' }}
            onClick={() => setCurrentView('floorplan')}
          >
            <Box size={14} color="var(--accent-blue)" />
            <span>3D Digital Twin &amp; Floor Plans</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: 700, marginLeft: '4px' }}>CAD</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.95rem' }}
            onClick={() => setCurrentView('properties')}
          >
            <Building2 size={14} color="var(--status-positive)" />
            <span>50+ Property Discovery</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--status-positive)', fontWeight: 700, marginLeft: '4px' }}>Jaipur/Jodhpur/Kota</span>
          </button>
        </div>

        {/* Telemetry Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, color: 'var(--status-positive)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-positive)', display: 'inline-block' }}></span>
              <span>TELEMETRY SYNCHRONIZED</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Updated 2 mins ago • Rajasthan Zone</span>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('predict')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={14} />
            <span>+ Analyze New Property</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. HERO PROPERTY SPOTLIGHT CARD (STITCH INSPIRATION)
          ------------------------------------------------------------------ */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, rgba(26, 31, 46, 0.9) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-positive)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                MODEL V4.2 RELIABLE
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                PENTHOUSE SUITE SPOTLIGHT
              </span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              Skyline Imperial Residence
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.25rem' }}>
              <MapPin size={14} color="var(--accent-blue)" />
              <span>Vaishali Nagar, Sector 4 • Jaipur, Rajasthan</span>
            </p>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                ₹1.35 <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Crore</span>
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-positive)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <TrendingUp size={12} /> +4.2% Alpha vs Locality
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>₹1,35,00,000 INR Indicative Fair Market Estimation</p>

            {/* Confidence Interval Slider Bar */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                <span>90% CI • P10: ₹1.27 Cr</span>
                <span style={{ color: 'var(--accent-cyan)' }}>Predicted: ₹1.35 Cr</span>
                <span>P90: ₹1.42 Cr</span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  left: '15%',
                  right: '12%',
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan), var(--status-positive))',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                <span>Conservative Baseline</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Unit: ₹7,500 / sq.ft</span>
                <span>Bull Scenario</span>
              </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setCurrentView('predict')}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Sliders size={15} />
                <span>Recalibrate Model</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentView('floorplan')}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Box size={15} color="var(--accent-blue)" />
                <span>Inspect 3D Digital Twin</span>
              </button>
            </div>
          </div>

          {/* 4 Quick Metric Tiles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User Rate</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹7,500</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>per sq.ft baseline</span>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Locality Avg</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹7,200</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--status-positive)', fontWeight: 600 }}>+4.16% Premium</span>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sub-Market Med</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹7,350</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Vaishali / C-Scheme</span>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Regression R²</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>0.912</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--status-positive)', fontWeight: 600 }}>Conf: 94% High</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. CORE KPI CARDS
          ------------------------------------------------------------------ */}
      <div className="kpi-grid">
        {/* Card 1 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Properties Analyzed</span>
            <div className="kpi-icon-box">
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value">{kpiData?.propertiesAnalyzed?.toLocaleString() || "1,284"}</div>
          <div className="kpi-trend" style={{ color: 'var(--status-positive)' }}>
            <TrendingUp size={14} />
            <span>+14.2% this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Estimated Value</span>
            <div className="kpi-icon-box" style={{ color: 'var(--accent-cyan)' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-value">{kpiData?.averageEstimatedValue || "₹72.5L"}</div>
          <div className="kpi-trend" style={{ color: 'var(--status-positive)' }}>
            <TrendingUp size={14} />
            <span>+3.8% vs last quarter</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Price / sq.ft</span>
            <div className="kpi-icon-box" style={{ color: 'var(--accent-violet)' }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="kpi-value">{kpiData?.averagePricePerSqFt || "₹4,028"}</div>
          <div className="kpi-trend" style={{ color: 'var(--status-positive)' }}>
            <TrendingUp size={14} />
            <span>+5.1% YoY</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Model Performance</span>
            <div className="kpi-icon-box" style={{ color: 'var(--status-positive)' }}>
              <Percent size={18} />
            </div>
          </div>
          <div className="kpi-value">{kpiData?.modelPerformanceR2 || "89% R²"}</div>
          <div className="kpi-trend" style={{ color: 'var(--status-positive)' }}>
            <CheckCircle2 size={14} />
            <span>High confidence score</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          4. DASHBOARD SPLIT: RECENT PREDICTIONS & MARKET SNAPSHOT
          ------------------------------------------------------------------ */}
      <div className="dashboard-split" style={{ marginTop: '2.5rem' }}>
        {/* Left: Recent Predictions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Recent Predictions
            </h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentView('history')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="property-grid-2col">
            {recentProps.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelectProperty={onSelectProperty}
                onOpen3D={onOpen3D}
              />
            ))}
          </div>
        </div>

        {/* Right: Market Snapshot */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem' }}>Market Snapshot</h3>
            <span className="badge badge-ai">Rajasthan Zone</span>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Average Price</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹71.2 Lakhs</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Price Growth (12M)</span>
                <span style={{ fontWeight: 700, color: 'var(--status-positive)' }}>+8.4%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Popular Property Type</span>
                <span style={{ fontWeight: 600 }}>3 BHK Luxury Villa</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Highest-Value Localities</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>C-Scheme &amp; Shastri Nagar</span>
              </div>
            </div>

            {/* Price per sq.ft Mini Trend */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Price/sq.ft Index (2024-26)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--status-positive)', fontWeight: 700 }}>+7.4%</span>
              </div>
              <LineChart data={miniTrendData} isArea={true} height={150} unit="₹" />
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={() => setCurrentView('insights')}
            >
              <span>Explore Detailed Market Insights</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
