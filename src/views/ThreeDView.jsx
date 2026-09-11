import React from 'react';
import { Box, Sparkles, Compass } from 'lucide-react';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';

export const ThreeDView = ({ property, setCurrentView }) => {
  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Spatial Computing & WebGL</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>Interactive 3D Property</h1>
          <p className="section-desc">
            Explore the architectural massing, change materials in real time, inspect camera angles, and toggle environmental landscaping.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentView('floorplan')}
          >
            <span>View Floor Plan Blueprint</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentView('tour')}
          >
            <Compass size={16} />
            <span>360° Interior Tour</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewer with customizer */}
      <ThreeDViewer property={property} height="640px" isHero={false} />

      {/* Helper Tips */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-blue)' }}>Orbit & Pan</h4>
          <p style={{ fontSize: '0.85rem' }}>Left-click and drag to orbit around the residence. Scroll wheel to zoom dynamically in and out.</p>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-blue)' }}>Camera Presets</h4>
          <p style={{ fontSize: '0.85rem' }}>Use the top-left pills to snap directly to Elevation Front, Rear, Aerial Top-Down, or Interior perspective.</p>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-blue)' }}>Live Customizer</h4>
          <p style={{ fontSize: '0.85rem' }}>Toggle exterior stucco colors, pool presence, garden landscaping, and garage bays with instant WebGL shader update.</p>
        </div>
      </div>
    </div>
  );
};
