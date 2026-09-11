import React, { useState, useRef } from 'react';
import { Compass, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

export const Tour360 = () => {
  const [panX, setPanX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX - panX;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - startXRef.current;
    setPanX(newX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={20} color="var(--accent-blue)" /> 360° Panoramic Property Tour
          </h3>
          <p style={{ fontSize: '0.85rem' }}>Drag horizontally to look around the open-plan modern living interior.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-button"
            onClick={() => setZoom(Math.max(0.8, zoom - 0.15))}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="icon-button"
            onClick={() => setZoom(Math.min(1.6, zoom + 0.15))}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div
        className="tour-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"
          alt="360 Modern Architectural Interior"
          className="tour-canvas"
          style={{
            transform: `scale(${zoom}) translateX(${panX * 0.15}px)`,
            transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out'
          }}
          draggable="false"
        />

        <div className="tour-overlay-instructions">
          <Move size={15} color="var(--accent-blue)" />
          <span>Click and drag horizontally to rotate panoramic perspective</span>
        </div>
      </div>
    </div>
  );
};
