import React, { useState } from 'react';
import { Gallery } from '../components/property/Gallery';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Layers,
  Car,
  CheckCircle2,
  Calendar,
  Share2,
  Heart,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const PropertyDetailView = ({ property, onBack, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);

  if (!property) return null;

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      {/* Back button & top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-button"
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Toggle favorite"
          >
            <Heart size={16} fill={isFavorite ? '#F43F5E' : 'none'} color={isFavorite ? '#F43F5E' : 'var(--text-secondary)'} />
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('predict')}
          >
            <Sparkles size={14} />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* Property Title & Pricing Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-ai">AI Score {property.aiScore || 89}%</span>
            <span className="badge badge-demo">{property.type}</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.35rem' }}>{property.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
            <MapPin size={16} color="var(--accent-blue)" />
            <span>{property.locality}, {property.location}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predicted Valuation</div>
          <div className="price-display" style={{ color: 'var(--accent-blue)' }}>
            ₹{property.predictedValue}L
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ₹{property.pricePerSqFt?.toLocaleString()} / sq.ft
          </div>
        </div>
      </div>

      {/* Primary Key Stats Bar */}
      <div className="card" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Maximize size={22} color="var(--accent-blue)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carpet Area</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.area} sq.ft</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bed size={22} color="var(--accent-blue)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bedrooms</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.bedrooms} Beds</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bath size={22} color="var(--accent-blue)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bathrooms</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.bathrooms} Baths</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Layers size={22} color="var(--accent-blue)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floors</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.floors} Floors</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Car size={22} color="var(--accent-blue)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parking</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.parking} Slots</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'photos', label: 'Photos & Media' },
          { id: '3dview', label: '3D View' },
          { id: 'valuation', label: 'AI Valuation' },
          { id: 'comparison', label: 'Market Comparison' }
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
          <div>
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Property Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                This premium contemporary residence in {property.locality} boasts cutting-edge geometric massing, floor-to-ceiling panoramic glass panels, and private landscaped outdoor gardens. Strategically situated within {property.location}, offering rapid arterial transit access and superior micro-market appreciation.
              </p>

              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.85rem' }}>Amenities & Features</h4>
              <div className="amenities-chip-grid">
                {property.amenities?.map((a, i) => (
                  <span key={i} className="amenity-chip selected">
                    <CheckCircle2 size={13} />
                    <span>{a}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Valuation Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Valuation Date</span>
                  <span style={{ fontWeight: 600 }}>{property.datePredicted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Furnishing</span>
                  <span style={{ fontWeight: 600 }}>{property.furnishing}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Property Age</span>
                  <span style={{ fontWeight: 600 }}>{property.age} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Model Confidence</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{property.aiScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PHOTOS */}
      {activeTab === 'photos' && (
        <Gallery images={property.gallery} defaultImage={property.imageUrl} />
      )}

      {/* TAB CONTENT: 3D VIEW */}
      {activeTab === '3dview' && (
        <ThreeDViewer property={property} height="580px" />
      )}

      {/* TAB CONTENT: AI VALUATION */}
      {activeTab === 'valuation' && (
        <div>
          <div className="result-hero-card">
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Estimated Property Value</div>
            <div className="result-main-price">
              ₹{property.predictedValue} <span style={{ fontSize: '2rem', color: 'var(--accent-blue)' }}>Lakhs</span>
            </div>
            <div className="price-range-bar-wrap">
              <div className="range-labels-row">
                <span>Lower: ₹{property.priceRange ? property.priceRange[0] : (property.predictedValue * 0.95).toFixed(1)}L</span>
                <span>Upper: ₹{property.priceRange ? property.priceRange[1] : (property.predictedValue * 1.05).toFixed(1)}L</span>
              </div>
              <div className="range-gradient-track">
                <div className="range-gradient-fill" />
                <div className="range-marker-pin" />
              </div>
            </div>
          </div>

          <FeatureImportanceChart />
        </div>
      )}

      {/* TAB CONTENT: MARKET COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="comparison-deltas-grid">
          <div className="card">
            <h4>Local Market Average</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--accent-blue)' }}>
              ₹{property.localAvgValue || 69.8}L
            </p>
            <span className="badge badge-positive">+3.9% Premium above benchmark comps</span>
          </div>

          <div className="card">
            <h4>Square Foot Valuation</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
              ₹{property.pricePerSqFt?.toLocaleString()}
            </p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Locality benchmark: ₹{property.localAvgPricePerSqFt || 3880} / sq.ft</span>
          </div>

          <div className="card">
            <h4>Algorithm Quality</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--status-positive)' }}>
              89% R² Score
            </p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>MAE ₹3.2L on cross validation</span>
          </div>
        </div>
      )}
    </div>
  );
};
