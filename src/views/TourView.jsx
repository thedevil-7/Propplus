import React from 'react';
import { Tour360 } from '../components/3d/Tour360';
import { Box, Layout } from 'lucide-react';

export const TourView = ({ setCurrentView }) => {
  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Virtual Reality Walkthrough</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>360° Panoramic Property Tour</h1>
          <p className="section-desc">
            Immerse yourself in high-definition panoramic room scans.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentView('threed')}>
            <Box size={16} />
            <span>Switch to Exterior 3D</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentView('floorplan')}>
            <Layout size={16} />
            <span>Blueprint Layout</span>
          </button>
        </div>
      </div>

      <Tour360 />
    </div>
  );
};
