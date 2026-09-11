import React from 'react';
import { MARKET_INSIGHTS } from '../api/mockData';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import {
  TrendingUp,
  MapPin,
  Flame,
  Award,
  BarChart3,
  Layers,
  PieChart
} from 'lucide-react';

export const MarketInsightsView = () => {
  const { cards, priceByLocation, priceTrend, pricePerSqFtArea, propertyTypeDistribution } = MARKET_INSIGHTS;

  const pricingFactors = [
    { label: "Carpet Square Footage", value: 40 },
    { label: "Locality & Metro Proximity", value: 30 },
    { label: "BHK Configuration", value: 15 },
    { label: "Ensuite Bathrooms", value: 8 },
    { label: "Structure Age (<5 Yrs)", value: 5 },
    { label: "Covered Parking", value: 2 }
  ];

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Macro Real Estate Intelligence</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>Market Insights</h1>
          <p className="section-desc">
            Regional pricing trends, square-foot appreciation cycles, and typology demand distribution.
          </p>
        </div>
        <span className="badge badge-demo">DEMO ANALYTICS DATASET</span>
      </div>

      {/* Insight Cards (4 KPI Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Best Value Area</span>
            <Award size={18} color="var(--status-positive)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {cards.bestValueArea}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--status-positive)' }}>+11.2% capital upside index</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Highest Average Price</span>
            <MapPin size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {cards.highestAveragePrice}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>₹14,500 / sq.ft average</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Fastest Growing Area</span>
            <Flame size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {cards.fastestGrowingArea}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>+14.8% YoY velocity</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Most Popular Layout</span>
            <Layers size={18} color="var(--accent-violet)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {cards.mostPopularType}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-violet)' }}>52% of all search volume</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          CHARTS GRID (5 CHARTS)
          ------------------------------------------------------------------ */}
      <div className="market-charts-grid">
        {/* Chart 1: Average Price by Location (Bar Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Average Price by Location</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Average residential property valuation across key regions (in Lakhs)</p>
            </div>
            <BarChart3 size={18} color="var(--accent-blue)" />
          </div>
          <BarChart data={priceByLocation} height={230} />
        </div>

        {/* Chart 2: Price Trend (Line Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Historical Price Appreciation Trend</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>5-year average property index progression (in Lakhs)</p>
            </div>
            <TrendingUp size={18} color="var(--status-positive)" />
          </div>
          <LineChart data={priceTrend} isArea={false} height={230} unit="₹" />
        </div>

        {/* Chart 3: Price per sq.ft (Area Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Price per sq.ft Quarterly Rate</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Continuous carpet rate index escalation (₹ / sq.ft)</p>
            </div>
            <TrendingUp size={18} color="var(--accent-cyan)" />
          </div>
          <LineChart data={pricePerSqFtArea} isArea={true} height={230} unit="₹" />
        </div>

        {/* Chart 4: Property Type Distribution (Donut Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Property Type Distribution</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Market inventory split by architectural category</p>
            </div>
            <PieChart size={18} color="var(--accent-violet)" />
          </div>
          <DonutChart data={propertyTypeDistribution} size={200} />
        </div>
      </div>

      {/* Chart 5: Most Important Pricing Factors (Horizontal Bar Chart) */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Most Important Pricing Factors</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Empirical weight coefficients computed across 10,000+ real estate valuation records.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pricingFactors.map((factor, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>{factor.label}</span>
                <span style={{ color: 'var(--accent-blue)' }}>{factor.value}% Influence</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${factor.value * 2.3}%`,
                    background: 'linear-gradient(90deg, var(--accent-blue), var(--primary-500))'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
