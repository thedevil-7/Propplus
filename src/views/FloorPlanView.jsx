import React from 'react';
import { FloorPlan } from '../components/architectural/FloorPlan';
import { Box, Compass } from 'lucide-react';

export const FloorPlanView = ({ setCurrentView }) => {
  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">2D Spatial Architecture</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>Architectural Floor Plan</h1>
          <p className="section-desc">
            Technical blueprint layout showing dimensions, flow circulation, and room zonings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentView('threed')}>
            <Box size={16} />
            <span>3D Model</span>
          </button>
          <button className="btn btn-primary" onClick={() => setCurrentView('predict')}>
            <span>Valuation Model</span>
          </button>
        </div>
      </div>

      <FloorPlan />
    </div>
  );
};
