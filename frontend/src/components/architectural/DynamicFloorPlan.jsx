import React, { useState, useMemo } from 'react';
import { formatPropertyValue } from '../../utils/formatters';

// Pre-defined architectural layout definitions with furniture coordinates
const LAYOUT_TEMPLATES = {
  1: [
    { id: 'living', name: 'Living Room', x: 20, y: 20, w: 250, h: 300, door: {x: 20, y: 50, w: 10, h: 40}, furniture: [{type: 'sofa', x: 40, y: 40}, {type: 'tv', x: 220, y: 150}] },
    { id: 'kitchen', name: 'Kitchen', x: 270, y: 20, w: 150, h: 180, door: {x: 270, y: 100, w: 10, h: 40}, furniture: [{type: 'counter', x: 290, y: 40}] },
    { id: 'bed1', name: 'Bedroom', x: 270, y: 200, w: 200, h: 220, door: {x: 270, y: 220, w: 10, h: 40}, furniture: [{type: 'bed', x: 300, y: 220}, {type: 'wardrobe', x: 420, y: 220}] },
    { id: 'bath1', name: 'Bathroom', x: 470, y: 200, w: 100, h: 140, door: {x: 470, y: 220, w: 10, h: 30}, furniture: [{type: 'tub', x: 490, y: 220}] },
    { id: 'balcony', name: 'Balcony', x: 20, y: 320, w: 250, h: 100, door: {x: 100, y: 320, w: 40, h: 10}, furniture: [{type: 'plant', x: 40, y: 340}] }
  ],
  2: [
    { id: 'living', name: 'Living Room', x: 20, y: 20, w: 280, h: 250, door: {x: 20, y: 50, w: 10, h: 40}, furniture: [{type: 'sofa', x: 40, y: 40}, {type: 'tv', x: 250, y: 120}] },
    { id: 'dining', name: 'Dining Area', x: 20, y: 270, w: 150, h: 150, door: null, furniture: [{type: 'dining_table', x: 50, y: 290}] },
    { id: 'kitchen', name: 'Kitchen', x: 170, y: 270, w: 130, h: 150, door: {x: 170, y: 290, w: 10, h: 40}, furniture: [{type: 'counter', x: 190, y: 290}] },
    { id: 'bed1', name: 'Master Bedroom', x: 300, y: 20, w: 200, h: 200, door: {x: 300, y: 50, w: 10, h: 40}, furniture: [{type: 'bed', x: 340, y: 40}, {type: 'wardrobe', x: 450, y: 40}] },
    { id: 'bath1', name: 'Ensuite', x: 500, y: 20, w: 100, h: 120, door: {x: 500, y: 40, w: 10, h: 30}, furniture: [{type: 'tub', x: 520, y: 40}] },
    { id: 'bed2', name: 'Bedroom 2', x: 300, y: 220, w: 180, h: 200, door: {x: 300, y: 250, w: 10, h: 40}, furniture: [{type: 'bed', x: 340, y: 240}] },
    { id: 'bath2', name: 'Bathroom', x: 480, y: 220, w: 100, h: 100, door: {x: 480, y: 240, w: 10, h: 30}, furniture: [{type: 'tub', x: 500, y: 240}] },
    { id: 'balcony', name: 'Balcony', x: 20, y: 420, w: 280, h: 80, door: {x: 120, y: 420, w: 40, h: 10}, furniture: [{type: 'plant', x: 40, y: 440}] }
  ],
  3: [
    { id: 'living', name: 'Large Living Room', x: 20, y: 20, w: 320, h: 260, door: {x: 20, y: 60, w: 10, h: 50}, furniture: [{type: 'sofa', x: 50, y: 50}, {type: 'tv', x: 280, y: 120}] },
    { id: 'dining', name: 'Dining Area', x: 20, y: 280, w: 160, h: 180, door: null, furniture: [{type: 'dining_table', x: 50, y: 310}] },
    { id: 'kitchen', name: 'Kitchen', x: 180, y: 280, w: 160, h: 180, door: {x: 180, y: 300, w: 10, h: 40}, furniture: [{type: 'counter', x: 210, y: 300}] },
    { id: 'bed1', name: 'Master Bedroom', x: 340, y: 20, w: 220, h: 220, door: {x: 340, y: 60, w: 10, h: 40}, furniture: [{type: 'bed', x: 380, y: 40}, {type: 'wardrobe', x: 510, y: 40}] },
    { id: 'bath1', name: 'Master Bath', x: 560, y: 20, w: 110, h: 130, door: {x: 560, y: 40, w: 10, h: 30}, furniture: [{type: 'tub', x: 580, y: 40}] },
    { id: 'bed2', name: 'Bedroom 2', x: 340, y: 240, w: 180, h: 220, door: {x: 340, y: 270, w: 10, h: 40}, furniture: [{type: 'bed', x: 370, y: 260}] },
    { id: 'bath2', name: 'Common Bath', x: 520, y: 240, w: 110, h: 100, door: {x: 520, y: 260, w: 10, h: 30}, furniture: [{type: 'tub', x: 540, y: 260}] },
    { id: 'bed3', name: 'Bedroom 3', x: 520, y: 340, w: 160, h: 160, door: {x: 520, y: 380, w: 10, h: 40}, furniture: [{type: 'bed', x: 550, y: 360}] },
    { id: 'balcony', name: 'Balcony', x: 20, y: 460, w: 320, h: 80, door: {x: 140, y: 460, w: 50, h: 10}, furniture: [{type: 'plant', x: 50, y: 480}] },
    { id: 'utility', name: 'Utility Area', x: 680, y: 20, w: 80, h: 120, door: {x: 680, y: 40, w: 10, h: 30}, furniture: [] }
  ],
  4: [
    { id: 'living', name: 'Large Living Room', x: 20, y: 20, w: 350, h: 280, door: {x: 20, y: 80, w: 10, h: 50}, furniture: [{type: 'sofa', x: 60, y: 60}, {type: 'tv', x: 310, y: 140}] },
    { id: 'dining', name: 'Dining', x: 20, y: 300, w: 180, h: 200, door: null, furniture: [{type: 'dining_table', x: 60, y: 330}] },
    { id: 'kitchen', name: 'Modular Kitchen', x: 200, y: 300, w: 170, h: 200, door: {x: 200, y: 330, w: 10, h: 40}, furniture: [{type: 'counter', x: 230, y: 330}] },
    { id: 'bed1', name: 'Master Bedroom', x: 370, y: 20, w: 250, h: 240, door: {x: 370, y: 70, w: 10, h: 40}, furniture: [{type: 'bed', x: 410, y: 50}, {type: 'wardrobe', x: 570, y: 50}] },
    { id: 'bath1', name: 'Master Bath', x: 620, y: 20, w: 140, h: 150, door: {x: 620, y: 50, w: 10, h: 30}, furniture: [{type: 'tub', x: 650, y: 50}] },
    { id: 'wardrobe1', name: 'Walk-in Wardrobe', x: 620, y: 170, w: 140, h: 90, door: {x: 620, y: 190, w: 10, h: 30}, furniture: [] },
    { id: 'bed2', name: 'Bedroom 2', x: 370, y: 260, w: 200, h: 240, door: {x: 370, y: 290, w: 10, h: 40}, furniture: [{type: 'bed', x: 400, y: 280}] },
    { id: 'bath2', name: 'Bath 2', x: 570, y: 260, w: 120, h: 120, door: {x: 570, y: 280, w: 10, h: 30}, furniture: [{type: 'tub', x: 590, y: 280}] },
    { id: 'bed3', name: 'Bedroom 3', x: 570, y: 380, w: 180, h: 160, door: {x: 570, y: 410, w: 10, h: 40}, furniture: [{type: 'bed', x: 600, y: 400}] },
    { id: 'bed4', name: 'Bedroom 4', x: 760, y: 20, w: 160, h: 200, door: {x: 760, y: 50, w: 10, h: 40}, furniture: [{type: 'bed', x: 790, y: 50}] },
    { id: 'bath4', name: 'Bath 4', x: 760, y: 220, w: 160, h: 100, door: {x: 760, y: 250, w: 10, h: 30}, furniture: [{type: 'tub', x: 790, y: 250}] },
    { id: 'balcony', name: 'Balcony', x: 20, y: 500, w: 350, h: 80, door: {x: 160, y: 500, w: 50, h: 10}, furniture: [{type: 'plant', x: 60, y: 520}] },
    { id: 'utility', name: 'Utility', x: 750, y: 380, w: 100, h: 160, door: {x: 750, y: 410, w: 10, h: 30}, furniture: [] }
  ]
};

const FurnitureIcon = ({ type, x, y, scale }) => {
  switch(type) {
    case 'sofa':
      return <path d={`M${x},${y} h${60*scale} v${20*scale} h${-60*scale} Z`} fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    case 'bed':
      return <rect x={x} y={y} width={50*scale} height={60*scale} rx="2" fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    case 'dining_table':
      return <circle cx={x+30*scale} cy={y+30*scale} r={25*scale} fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    case 'counter':
      return <rect x={x} y={y} width={60*scale} height={30*scale} fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    case 'wardrobe':
      return <rect x={x} y={y} width={40*scale} height={20*scale} fill="#F0F4FF" stroke="#3159C9" strokeWidth="1" />;
    case 'tv':
      return <rect x={x} y={y} width={40*scale} height={5*scale} fill="#3159C9" />;
    case 'tub':
      return <rect x={x} y={y} width={30*scale} height={20*scale} rx="10" fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    case 'plant':
      return <circle cx={x+10*scale} cy={y+10*scale} r={10*scale} fill="#EAF0FF" stroke="#3159C9" strokeWidth="1" />;
    default:
      return null;
  }
};

export const DynamicFloorPlan = ({ property }) => {
  const [showFurniture, setShowFurniture] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [roomsMode, setRoomsMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({x: 0, y: 0});

  const propertyId = property?.id || "PP-8402";
  const bedrooms = Math.min(4, Math.max(1, parseInt(property?.bedrooms) || 2));
  const areaSqft = property?.area || 1200;
  const location = property?.locality ? `${property.locality}, ${property.location}` : (property?.location || "Jaipur");
  
  const layout = LAYOUT_TEMPLATES[bedrooms] || LAYOUT_TEMPLATES[2];

  // Dynamic scaling based on area
  const baseArea = bedrooms === 1 ? 600 : bedrooms === 2 ? 1000 : bedrooms === 3 ? 1500 : 2500;
  const scaleRatio = Math.sqrt(Math.max(0.5, areaSqft / baseArea));

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({x: 0, y: 0});
    setShowFurniture(false);
    setShowDimensions(false);
    setRoomsMode(false);
    setSelectedRoom(null);
  };

  // Convert SVG coordinate area to square feet approx
  const getRoomDims = (w, h) => {
    // 10 svg units ~ 1 foot
    const wFt = Math.round((w / 15) * scaleRatio);
    const hFt = Math.round((h / 15) * scaleRatio);
    return `${wFt}' × ${hFt}'`;
  };

  const getRoomArea = (w, h) => {
    const wFt = (w / 15) * scaleRatio;
    const hFt = (h / 15) * scaleRatio;
    return Math.round(wFt * hFt);
  };

  const getRoomColor = (roomId) => {
    if (selectedRoom === roomId) return '#EAF0FF';
    if (roomsMode) return '#F8FAFC';
    return '#FFFFFF';
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            AI GENERATED 2D FLOOR PLAN
          </div>
          <div style={{ fontSize: '1.5rem', color: 'var(--primary-700)', fontWeight: 800, marginBottom: '0.5rem' }}>
            {bedrooms} BHK • {areaSqft.toLocaleString()} sq.ft • {location}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Property ID: {propertyId}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <span className="badge" style={{ background: '#F0F4FF', color: '#3159C9', border: '1px solid #3159C9', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
            ✦ AI GENERATED
          </span>
          <span className="badge" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)', padding: '6px 12px', fontSize: '0.75rem' }}>
            PROPERTY-SPECIFIC LAYOUT
          </span>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setShowFurniture(false); setShowDimensions(false); setRoomsMode(false); setSelectedRoom(null); }}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #3159C9', background: (!showFurniture && !showDimensions && !roomsMode) ? '#3159C9' : '#FFF', color: (!showFurniture && !showDimensions && !roomsMode) ? '#FFF' : '#3159C9', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Floor Plan
          </button>
          <button 
            onClick={() => { setShowFurniture(!showFurniture); setRoomsMode(false); }}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #3159C9', background: showFurniture ? '#3159C9' : '#FFF', color: showFurniture ? '#FFF' : '#3159C9', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Furniture
          </button>
          <button 
            onClick={() => { setShowDimensions(!showDimensions); setRoomsMode(false); }}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #3159C9', background: showDimensions ? '#3159C9' : '#FFF', color: showDimensions ? '#FFF' : '#3159C9', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Dimensions
          </button>
          <button 
            onClick={() => { setRoomsMode(!roomsMode); setShowFurniture(false); setShowDimensions(false); }}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #3159C9', background: roomsMode ? '#3159C9' : '#FFF', color: roomsMode ? '#FFF' : '#3159C9', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Rooms
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: '#FFF', cursor: 'pointer' }}>+</button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: '#FFF', cursor: 'pointer' }}>-</button>
          <button onClick={resetView} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: '#F8FAFC', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
        </div>
      </div>

      {/* SVG CONTAINER */}
      <div 
        style={{ 
          width: '100%', 
          height: '500px', 
          background: '#F8FAFC', 
          borderRadius: '12px', 
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center',
          transition: isDragging ? 'none' : 'transform 0.2s',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg viewBox="0 0 1000 650" style={{ width: '100%', height: '100%', maxWidth: '900px' }}>
            <g transform={`scale(${scaleRatio}) translate(${(1 - scaleRatio) * 500}, ${(1 - scaleRatio) * 300})`}>
              {/* Rooms */}
              {layout.map((room) => (
                <g 
                  key={room.id}
                  onClick={(e) => {
                    if (roomsMode) {
                      e.stopPropagation();
                      setSelectedRoom(room.id);
                    }
                  }}
                  style={{ cursor: roomsMode ? 'pointer' : 'default' }}
                >
                  <rect 
                    x={room.x} y={room.y} width={room.w} height={room.h}
                    fill={getRoomColor(room.id)}
                    stroke="#AAB8E0"
                    strokeWidth="2"
                  />
                  
                  {/* Doors */}
                  {room.door && (
                    <rect 
                      x={room.door.x} y={room.door.y} 
                      width={room.door.w} height={room.door.h}
                      fill="#FFFFFF"
                      stroke="#AAB8E0"
                      strokeWidth="1"
                    />
                  )}

                  {/* Furniture */}
                  {showFurniture && room.furniture?.map((furn, idx) => (
                    <FurnitureIcon key={idx} type={furn.type} x={furn.x} y={furn.y} scale={1} />
                  ))}

                  {/* Room Name & Dimensions */}
                  {(!roomsMode || selectedRoom === room.id || !selectedRoom) && (
                    <text 
                      x={room.x + room.w / 2} 
                      y={room.y + room.h / 2} 
                      fill="#3159C9" 
                      fontSize="14" 
                      fontWeight="600" 
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {room.name.toUpperCase()}
                    </text>
                  )}

                  {showDimensions && (
                    <text 
                      x={room.x + room.w / 2} 
                      y={room.y + room.h / 2 + 20} 
                      fill="#64748B" 
                      fontSize="12" 
                      fontWeight="500"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {getRoomDims(room.w, room.h)}
                    </text>
                  )}
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Selected Room Info Card */}
        {roomsMode && selectedRoom && (
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: '#FFFFFF', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', minWidth: '200px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3159C9', marginBottom: '8px' }}>
              {layout.find(r => r.id === selectedRoom)?.name}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Size: {getRoomDims(layout.find(r => r.id === selectedRoom)?.w, layout.find(r => r.id === selectedRoom)?.h)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Approx. Area: {getRoomArea(layout.find(r => r.id === selectedRoom)?.w, layout.find(r => r.id === selectedRoom)?.h)} sq.ft
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
