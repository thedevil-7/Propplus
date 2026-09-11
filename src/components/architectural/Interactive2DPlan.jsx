import React from 'react';
import { Compass, Maximize2, Layers, Check, Info, Move } from 'lucide-react';

export const Interactive2DPlan = ({
  selectedRoomId = 'living',
  onSelectRoom,
  mode = 'cad', // 'cad' | 'mapping' | 'minimap'
  showDimensions = true,
  showZoning = false,
  showCompass = true,
  height = '100%',
  width = '100%'
}) => {
  // Functional Zones
  // Public (Living/Dining/Foyer)
  // Private (Master Bed, Bed 2)
  // Culinary (Kitchen)
  // Sanitary (Baths)
  // Outdoor (Balcony/Deck)

  const isMapping = mode === 'mapping' || showZoning;
  const isMinimap = mode === 'minimap';

  const handleRoomClick = (roomId, roomData) => {
    if (onSelectRoom) {
      onSelectRoom(roomId, roomData);
    }
  };

  return (
    <div style={{ position: 'relative', width, height, background: isMinimap ? 'rgba(9, 14, 26, 0.95)' : '#080D1A', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Blueprint Grid Definition */}
      <svg
        viewBox="0 0 800 560"
        style={{ width: '100%', height: '100%', maxHeight: isMinimap ? '240px' : '560px', userSelect: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cad-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="0.5" />
          </pattern>
          <pattern id="hatch-wall" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
          </pattern>
          <marker id="dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--accent-cyan)" />
          </marker>
        </defs>

        {/* Blueprint background grid */}
        <rect width="800" height="560" fill="url(#cad-grid-pattern)" />

        {/* Outer Perimeter Footprint Wall (9" Load Bearing) */}
        <rect
          x="50"
          y="40"
          width="700"
          height="480"
          fill="none"
          stroke="var(--border-medium)"
          strokeWidth="6"
          rx="2"
        />

        {/* -------------------------------------------------------------
            1. ROOM: LIVING & DINING LOUNGE (Zone: Public)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('living', {
            id: 'living',
            name: 'Double Height Living Room',
            carpet: '360 sq.ft',
            dimensions: "24' 0\" x 16' 0\"",
            finish: 'Italian Botticino Marble',
            desc: "24' x 16' • Floor to ceiling double glazed structural glass facing South-West"
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="50"
            y="40"
            width="370"
            height="300"
            fill={isMapping ? 'rgba(6, 182, 212, 0.22)' : (selectedRoomId === 'living' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'living' ? 'var(--accent-cyan)' : '#334155'}
            strokeWidth={selectedRoomId === 'living' ? '3' : '1.5'}
            strokeDasharray={selectedRoomId === 'living' ? 'none' : 'none'}
          />
          {/* Room Text Label */}
          <text x="235" y="170" fill={selectedRoomId === 'living' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "14" : "16"} fontWeight="700" textAnchor="middle">
            LIVING &amp; DINING LOUNGE
          </text>
          <text x="235" y="195" fill="var(--accent-cyan)" fontSize={isMinimap ? "11" : "13"} fontWeight="600" textAnchor="middle">
            360 SQ.FT • 24' 0" × 16' 0"
          </text>
          {isMapping && (
            <text x="235" y="215" fill="#94A3B8" fontSize="10" textAnchor="middle" letterSpacing="0.08em">
              [PUBLIC ENTERTAINING ZONE • 32%]
            </text>
          )}
        </g>

        {/* -------------------------------------------------------------
            2. ROOM: MODULAR ITALIAN KITCHEN (Zone: Culinary)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('kitchen', {
            id: 'kitchen',
            name: 'Modular Italian Kitchen',
            carpet: '120 sq.ft',
            dimensions: "12' 0\" x 10' 0\"",
            finish: 'Quartz Island & European Chimney',
            desc: '120 sq.ft • Quartz island counter with built-in European chimney and appliances'
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="420"
            y="40"
            width="200"
            height="180"
            fill={isMapping ? 'rgba(16, 185, 129, 0.22)' : (selectedRoomId === 'kitchen' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'kitchen' ? 'var(--status-positive)' : '#334155'}
            strokeWidth={selectedRoomId === 'kitchen' ? '3' : '1.5'}
          />
          {/* Kitchen Island Schematic */}
          <rect x="470" y="90" width="100" height="50" fill="rgba(255,255,255,0.06)" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" rx="3" />
          <text x="520" y="118" fill="#CBD5E1" fontSize="10" textAnchor="middle">ISLAND COUNTER</text>

          <text x="520" y="70" fill={selectedRoomId === 'kitchen' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "12" : "14"} fontWeight="700" textAnchor="middle">
            KITCHEN
          </text>
          <text x="520" y="160" fill="var(--status-positive)" fontSize={isMinimap ? "10" : "12"} fontWeight="600" textAnchor="middle">
            120 SQ.FT • 12' × 10'
          </text>
        </g>

        {/* -------------------------------------------------------------
            3. ROOM: FOYER & UTILITY PANTRY (Zone: Service/Entry)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('foyer', {
            id: 'foyer',
            name: 'Private Entrance Foyer',
            carpet: '70 sq.ft',
            dimensions: "10' 0\" x 7' 0\"",
            finish: 'Textured Teak Panelling',
            desc: "70 sq.ft • Private vestibule with biometric smart door and shoe niche"
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="620"
            y="40"
            width="130"
            height="180"
            fill={isMapping ? 'rgba(148, 163, 184, 0.18)' : (selectedRoomId === 'foyer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'foyer' ? 'var(--accent-blue)' : '#334155'}
            strokeWidth={selectedRoomId === 'foyer' ? '3' : '1.5'}
          />
          <text x="685" y="115" fill={selectedRoomId === 'foyer' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "11" : "13"} fontWeight="600" textAnchor="middle">
            ENTRY FOYER
          </text>
          <text x="685" y="135" fill="#94A3B8" fontSize={isMinimap ? "9" : "11"} textAnchor="middle">
            70 SQ.FT
          </text>
          {/* Main Entrance Door Swing */}
          <path d="M 740 40 A 45 45 0 0 1 695 85" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="740" y1="40" x2="695" y2="40" stroke="var(--accent-cyan)" strokeWidth="2" />
        </g>

        {/* -------------------------------------------------------------
            4. ROOM: MASTER BEDROOM SUITE (Zone: Private)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('master', {
            id: 'master',
            name: 'Master Suite (Bed 1)',
            carpet: '180 sq.ft',
            dimensions: "15' 0\" x 16' 0\"",
            finish: 'Attached Bath & Balcony Deck',
            desc: "15' x 16' • Walk-in dressing wardrobe and private skyline deck access"
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="420"
            y="220"
            width="330"
            height="300"
            fill={isMapping ? 'rgba(99, 102, 241, 0.22)' : (selectedRoomId === 'master' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'master' ? 'var(--primary-500)' : '#334155'}
            strokeWidth={selectedRoomId === 'master' ? '3' : '1.5'}
          />
          {/* King Bed Schematic */}
          <rect x="470" y="270" width="120" height="110" fill="rgba(255,255,255,0.06)" stroke="#64748B" strokeWidth="1" rx="4" />
          <line x1="470" y1="310" x2="590" y2="310" stroke="#64748B" strokeWidth="1" />
          <text x="530" y="295" fill="#94A3B8" fontSize="10" textAnchor="middle">KING BED</text>

          <text x="585" y="420" fill={selectedRoomId === 'master' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "13" : "15"} fontWeight="700" textAnchor="middle">
            MASTER SUITE (BED 1)
          </text>
          <text x="585" y="445" fill="var(--primary-500)" fontSize={isMinimap ? "11" : "13"} fontWeight="600" textAnchor="middle">
            180 SQ.FT • 15' × 16'
          </text>
          {isMapping && (
            <text x="585" y="465" fill="#94A3B8" fontSize="10" textAnchor="middle" letterSpacing="0.08em">
              [PRIMARY SANCTUARY ZONE • 22%]
            </text>
          )}

          {/* Master Ensuite Bath Partition */}
          <rect x="630" y="220" width="120" height="110" fill="rgba(56, 189, 248, 0.12)" stroke="#475569" strokeWidth="1" />
          <text x="690" y="270" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">ENSUITE</text>
          <text x="690" y="285" fill="#64748B" fontSize="9" textAnchor="middle">75 sq.ft</text>
        </g>

        {/* -------------------------------------------------------------
            5. ROOM: BEDROOM 2 / GUEST SUITE (Zone: Private)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('bed2', {
            id: 'bed2',
            name: 'Bedroom 2 (Guest Suite)',
            carpet: '145 sq.ft',
            dimensions: "12' 0\" x 15' 0\"",
            finish: 'Wardrobe Niche & Ensuite',
            desc: "12' x 15' • Well-ventilated executive guest suite with fitted wardrobes"
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="50"
            y="340"
            width="250"
            height="180"
            fill={isMapping ? 'rgba(99, 102, 241, 0.16)' : (selectedRoomId === 'bed2' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'bed2' ? 'var(--accent-blue)' : '#334155'}
            strokeWidth={selectedRoomId === 'bed2' ? '3' : '1.5'}
          />
          {/* Queen Bed Schematic */}
          <rect x="80" y="380" width="90" height="90" fill="rgba(255,255,255,0.06)" stroke="#64748B" strokeWidth="1" rx="3" />
          <text x="125" y="415" fill="#94A3B8" fontSize="9" textAnchor="middle">QUEEN</text>

          <text x="175" y="375" fill={selectedRoomId === 'bed2' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "12" : "14"} fontWeight="700" textAnchor="middle">
            BEDROOM 2
          </text>
          <text x="175" y="495" fill="var(--accent-cyan)" fontSize={isMinimap ? "10" : "12"} fontWeight="600" textAnchor="middle">
            145 SQ.FT • 12' × 15'
          </text>
        </g>

        {/* -------------------------------------------------------------
            6. ROOM: SKYLINE SUNSET BALCONY / TERRACE (Zone: Deck)
            ------------------------------------------------------------- */}
        <g
          className="svg-room-interactive"
          onClick={() => handleRoomClick('balcony', {
            id: 'balcony',
            name: 'Sunset Skyline Deck',
            carpet: '80 sq.ft',
            dimensions: "16' 0\" x 5' 0\"",
            finish: 'Weatherproof Composite Decking',
            desc: "Panoramic west-facing cantilevered terrace with glass railing"
          })}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="300"
            y="340"
            width="120"
            height="180"
            fill={isMapping ? 'rgba(245, 158, 11, 0.22)' : (selectedRoomId === 'balcony' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(30, 41, 59, 0.45)')}
            stroke={selectedRoomId === 'balcony' ? 'var(--accent-amber)' : '#334155'}
            strokeWidth={selectedRoomId === 'balcony' ? '3' : '1.5'}
          />
          {/* Deck Planks pattern */}
          <line x1="320" y1="350" x2="320" y2="510" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="350" y1="350" x2="350" y2="510" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="380" y1="350" x2="380" y2="510" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" strokeDasharray="4 4" />

          <text x="360" y="420" fill={selectedRoomId === 'balcony' ? '#FFFFFF' : '#E2E8F0'} fontSize={isMinimap ? "11" : "13"} fontWeight="700" textAnchor="middle">
            SKY DECK
          </text>
          <text x="360" y="445" fill="var(--accent-amber)" fontSize={isMinimap ? "9" : "11"} fontWeight="600" textAnchor="middle">
            80 SQ.FT
          </text>
        </g>

        {/* -------------------------------------------------------------
            7. ARCHITECTURAL DETAILS: COLUMNS, DOORS, WINDOWS
            ------------------------------------------------------------- */}
        {/* Structural Column Nodes (Reinforced Concrete) */}
        {[
          [50, 40], [420, 40], [620, 40], [750, 40],
          [50, 340], [420, 220], [420, 340], [750, 220],
          [50, 520], [300, 520], [420, 520], [750, 520]
        ].map(([cx, cy], idx) => (
          <rect
            key={idx}
            x={cx - 5}
            y={cy - 5}
            width="10"
            height="10"
            fill="var(--accent-cyan)"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        ))}

        {/* Door Swings */}
        {/* Master Bed Door */}
        <path d="M 420 250 A 35 35 0 0 1 455 285" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="420" y1="250" x2="420" y2="285" stroke="#94A3B8" strokeWidth="2" />

        {/* Bedroom 2 Door */}
        <path d="M 230 340 A 35 35 0 0 1 265 375" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="230" y1="340" x2="230" y2="375" stroke="#94A3B8" strokeWidth="2" />

        {/* Balcony Slider Glass Door */}
        <line x1="300" y1="340" x2="420" y2="340" stroke="var(--accent-cyan)" strokeWidth="3" />
        <line x1="300" y1="344" x2="420" y2="344" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Window Fenestrations (Double lines on exterior) */}
        {/* Living Room Panoramic Window */}
        <line x1="50" y1="80" x2="50" y2="260" stroke="var(--accent-cyan)" strokeWidth="4" />
        <line x1="46" y1="80" x2="46" y2="260" stroke="#FFFFFF" strokeWidth="1" />

        {/* Master Bedroom South Glazing */}
        <line x1="750" y1="280" x2="750" y2="460" stroke="var(--accent-cyan)" strokeWidth="4" />
        <line x1="754" y1="280" x2="754" y2="460" stroke="#FFFFFF" strokeWidth="1" />

        {/* -------------------------------------------------------------
            8. TECHNICAL CAD DIMENSION STRINGS
            ------------------------------------------------------------- */}
        {showDimensions && !isMinimap && (
          <g className="cad-dimensions" opacity="0.85">
            {/* Top Width Dimension Line */}
            <line x1="50" y1="22" x2="750" y2="22" stroke="var(--accent-cyan)" strokeWidth="1.5" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)" />
            <rect x="360" y="12" width="80" height="20" fill="#080D1A" rx="3" />
            <text x="400" y="26" fill="var(--accent-cyan)" fontSize="11" fontWeight="700" textAnchor="middle">
              56' 0" OVERALL
            </text>

            {/* Left Height Dimension Line */}
            <line x1="26" y1="40" x2="26" y2="520" stroke="var(--accent-cyan)" strokeWidth="1.5" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)" />
            <rect x="2" y="270" width="48" height="20" fill="#080D1A" rx="3" />
            <text x="26" y="284" fill="var(--accent-cyan)" fontSize="11" fontWeight="700" textAnchor="middle">
              38' 6"
            </text>
          </g>
        )}

        {/* -------------------------------------------------------------
            9. SPATIAL MAPPING FLOW CIRCULATION PATHS
            ------------------------------------------------------------- */}
        {isMapping && (
          <g className="circulation-flow" opacity="0.9">
            {/* Circulation pathway dashed line */}
            <path
              d="M 685 150 L 520 200 L 235 240 L 360 380 L 585 360"
              fill="none"
              stroke="var(--accent-amber)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <circle cx="685" cy="150" r="5" fill="var(--accent-amber)" />
            <text x="685" y="175" fill="var(--accent-amber)" fontSize="10" fontWeight="700" textAnchor="middle">MAIN ENTRY</text>
            <circle cx="585" cy="360" r="5" fill="var(--primary-500)" />
          </g>
        )}

        {/* -------------------------------------------------------------
            10. MINIMAP CAMERA FOV CONE & BEACON
            ------------------------------------------------------------- */}
        {isMinimap && (
          <g className="minimap-camera-beacon">
            {/* Camera Flashlight FOV Cone */}
            <path
              d="M 235 170 L 150 70 L 320 70 Z"
              fill="rgba(56, 189, 248, 0.25)"
              stroke="var(--accent-cyan)"
              strokeWidth="1"
            />
            {/* User Point Beacon */}
            <circle cx="235" cy="170" r="8" fill="var(--accent-cyan)" />
            <circle cx="235" cy="170" r="14" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* -------------------------------------------------------------
            11. VASTU / NORTH COMPASS ROSE
            ------------------------------------------------------------- */}
        {showCompass && (
          <g transform="translate(730, 80)">
            <circle cx="0" cy="0" r="22" fill="rgba(15, 23, 42, 0.85)" stroke="var(--border-medium)" strokeWidth="1.5" />
            <polygon points="0,-16 5,0 -5,0" fill="#EF4444" />
            <polygon points="0,16 5,0 -5,0" fill="#94A3B8" />
            <text x="0" y="-18" fill="#EF4444" fontSize="10" fontWeight="800" textAnchor="middle">N</text>
            <text x="0" y="26" fill="#94A3B8" fontSize="8" fontWeight="700" textAnchor="middle">S</text>
            <text x="24" y="3" fill="#94A3B8" fontSize="8" fontWeight="700" textAnchor="middle">E</text>
            <text x="-24" y="3" fill="#94A3B8" fontSize="8" fontWeight="700" textAnchor="middle">W</text>
          </g>
        )}
      </svg>

      {/* Floating Mode Overlay Badge */}
      <div style={{ position: 'absolute', bottom: '12px', left: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
        <span style={{
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: isMapping ? 'var(--accent-amber)' : 'var(--accent-cyan)',
          letterSpacing: '0.06em'
        }}>
          {isMapping ? 'SPATIAL ZONING & CIRCULATION' : (isMinimap ? '2D RADAR MAPPING' : '2D ARCHITECTURAL CAD SCHEMATIC')}
        </span>
      </div>
    </div>
  );
};

export default Interactive2DPlan;
