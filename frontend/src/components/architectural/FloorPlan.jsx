import React, { useState } from 'react';
import { FLOOR_PLAN_ROOMS } from '../../api/mockData';
import { Maximize2, Layers, Check, Info } from 'lucide-react';

export const FloorPlan = () => {
  const [selectedRoomId, setSelectedRoomId] = useState('master_bed');

  const selectedRoom = FLOOR_PLAN_ROOMS.find((r) => r.id === selectedRoomId) || FLOOR_PLAN_ROOMS[0];

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-tag">Architectural Blueprint</span>
        <h2 className="section-title">Interactive Floor Plan</h2>
        <p className="section-desc">
          Click on any architectural partition or zone to inspect dimension metrics, square footage, and level placement.
        </p>
      </div>

      <div className="floorplan-container">
        {/* SVG Blueprint Canvas */}
        <div className="floorplan-canvas-box">
          <svg
            viewBox="0 0 600 420"
            className="architectural-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid background lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#grid)" />

            {/* Exterior Walls */}
            <rect x="30" y="30" width="540" height="360" fill="none" stroke="#64748B" strokeWidth="4" rx="2" />

            {/* Garage */}
            <g
              className={`svg-room ${selectedRoomId === 'garage' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('garage')}
            >
              <rect x="410" y="30" width="160" height="170" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="490" y="115" fill="#94A3B8" fontSize="13" fontWeight="600" textAnchor="middle">Covered Garage</text>
              <text x="490" y="135" fill="#64748B" fontSize="11" textAnchor="middle">280 sq.ft</text>
            </g>

            {/* Living Room */}
            <g
              className={`svg-room ${selectedRoomId === 'living' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('living')}
            >
              <rect x="30" y="30" width="230" height="210" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="145" y="130" fill="#94A3B8" fontSize="14" fontWeight="600" textAnchor="middle">Living Room</text>
              <text x="145" y="150" fill="#64748B" fontSize="11" textAnchor="middle">320 sq.ft</text>
            </g>

            {/* Kitchen */}
            <g
              className={`svg-room ${selectedRoomId === 'kitchen' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('kitchen')}
            >
              <rect x="260" y="30" width="150" height="140" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="335" y="95" fill="#94A3B8" fontSize="13" fontWeight="600" textAnchor="middle">Kitchen</text>
              <text x="335" y="115" fill="#64748B" fontSize="11" textAnchor="middle">160 sq.ft</text>
            </g>

            {/* Primary Bath */}
            <g
              className={`svg-room ${selectedRoomId === 'bathroom' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('bathroom')}
            >
              <rect x="260" y="170" width="150" height="90" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="335" y="210" fill="#94A3B8" fontSize="12" fontWeight="600" textAnchor="middle">Bath & Spa</text>
              <text x="335" y="228" fill="#64748B" fontSize="10" textAnchor="middle">90 sq.ft</text>
            </g>

            {/* Master Bedroom */}
            <g
              className={`svg-room ${selectedRoomId === 'master_bed' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('master_bed')}
            >
              <rect x="30" y="240" width="210" height="150" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="135" y="310" fill="#94A3B8" fontSize="13" fontWeight="600" textAnchor="middle">Master Bedroom</text>
              <text x="135" y="330" fill="#64748B" fontSize="11" textAnchor="middle">240 sq.ft</text>
            </g>

            {/* Bedroom 2 */}
            <g
              className={`svg-room ${selectedRoomId === 'bed_2' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('bed_2')}
            >
              <rect x="240" y="260" width="160" height="130" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="320" y="320" fill="#94A3B8" fontSize="13" fontWeight="600" textAnchor="middle">Bedroom 2</text>
              <text x="320" y="340" fill="#64748B" fontSize="11" textAnchor="middle">180 sq.ft</text>
            </g>

            {/* Bedroom 3 */}
            <g
              className={`svg-room ${selectedRoomId === 'bed_3' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('bed_3')}
            >
              <rect x="400" y="200" width="170" height="120" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
              <text x="485" y="255" fill="#94A3B8" fontSize="13" fontWeight="600" textAnchor="middle">Bedroom 3</text>
              <text x="485" y="275" fill="#64748B" fontSize="11" textAnchor="middle">150 sq.ft</text>
            </g>

            {/* Balcony */}
            <g
              className={`svg-room ${selectedRoomId === 'balcony' ? 'selected' : ''}`}
              onClick={() => setSelectedRoomId('balcony')}
            >
              <rect x="400" y="320" width="170" height="70" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
              <text x="485" y="355" fill="#94A3B8" fontSize="12" fontWeight="600" textAnchor="middle">Sky Balcony</text>
              <text x="485" y="372" fill="#64748B" fontSize="10" textAnchor="middle">120 sq.ft</text>
            </g>
          </svg>
        </div>

        {/* Room Details Inspector Card */}
        <div className="room-details-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-ai">{selectedRoom.floor}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zone #{selectedRoom.id}</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {selectedRoom.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>
              {selectedRoom.area}
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>sq.ft carpet area</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dimensions</span>
              <span style={{ fontWeight: 600 }}>{selectedRoom.dimensions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Orientation</span>
              <span style={{ fontWeight: 600 }}>North-East Sun Facing</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Flooring</span>
              <span style={{ fontWeight: 600 }}>Italian Statuario Marble</span>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {selectedRoom.description}
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {FLOOR_PLAN_ROOMS.map((r) => (
              <button
                key={r.id}
                className={`toggle-chip ${selectedRoomId === r.id ? 'active' : ''}`}
                onClick={() => setSelectedRoomId(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
