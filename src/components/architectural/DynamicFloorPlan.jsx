import React, { useState, useMemo } from 'react';
import { Maximize2, Layers, Info, CheckCircle2, Download, HelpCircle, Lock } from 'lucide-react';
import { formatPropertyValue } from '../../utils/formatters';

// Pre-defined architectural layouts based on BHK and price tier
const LAYOUT_TEMPLATES = {
  1: {
    Compact: [
      { id: 'living', name: 'Living & Dining', type: 'public', x: 20, y: 20, w: 200, h: 250 },
      { id: 'kitchen', name: 'Kitchen', type: 'culinary', x: 220, y: 20, w: 100, h: 100 },
      { id: 'bed1', name: 'Bedroom', type: 'private', x: 220, y: 120, w: 150, h: 150 },
      { id: 'bath1', name: 'Bathroom', type: 'sanitary', x: 320, y: 20, w: 50, h: 100 },
    ],
    Premium: [
      { id: 'living', name: 'Large Living & Dining', type: 'public', x: 20, y: 20, w: 250, h: 300 },
      { id: 'kitchen', name: 'Modular Kitchen', type: 'culinary', x: 270, y: 20, w: 150, h: 120 },
      { id: 'bed1', name: 'Master Bedroom', type: 'private', x: 270, y: 140, w: 200, h: 180 },
      { id: 'bath1', name: 'Ensuite Bath', type: 'sanitary', x: 420, y: 20, w: 50, h: 120 },
      { id: 'balcony', name: 'Balcony', type: 'outdoor', x: 20, y: 320, w: 250, h: 60 },
    ]
  },
  2: {
    Compact: [
      { id: 'living', name: 'Living Room', type: 'public', x: 20, y: 20, w: 200, h: 200 },
      { id: 'kitchen', name: 'Kitchen', type: 'culinary', x: 220, y: 20, w: 100, h: 120 },
      { id: 'bed1', name: 'Master Bed', type: 'private', x: 20, y: 220, w: 150, h: 150 },
      { id: 'bath1', name: 'Bath 1', type: 'sanitary', x: 170, y: 220, w: 50, h: 80 },
      { id: 'bed2', name: 'Bed 2', type: 'private', x: 220, y: 140, w: 150, h: 140 },
      { id: 'bath2', name: 'Bath 2', type: 'sanitary', x: 370, y: 140, w: 50, h: 80 },
    ],
    Premium: [
      { id: 'living', name: 'Premium Living', type: 'public', x: 20, y: 20, w: 250, h: 220 },
      { id: 'kitchen', name: 'Open Kitchen', type: 'culinary', x: 270, y: 20, w: 150, h: 150 },
      { id: 'bed1', name: 'Master Bed', type: 'private', x: 20, y: 240, w: 200, h: 180 },
      { id: 'bath1', name: 'Master Bath', type: 'sanitary', x: 220, y: 240, w: 80, h: 100 },
      { id: 'bed2', name: 'Guest Room', type: 'private', x: 300, y: 240, w: 180, h: 150 },
      { id: 'bath2', name: 'Guest Bath', type: 'sanitary', x: 420, y: 20, w: 80, h: 100 },
      { id: 'balcony', name: 'Large Balcony', type: 'outdoor', x: 20, y: 420, w: 460, h: 60 },
    ]
  },
  3: {
    Compact: [
      { id: 'living', name: 'Living & Dining', type: 'public', x: 20, y: 20, w: 200, h: 250 },
      { id: 'kitchen', name: 'Kitchen', type: 'culinary', x: 220, y: 20, w: 120, h: 120 },
      { id: 'bed1', name: 'Master Bed', type: 'private', x: 20, y: 270, w: 150, h: 150 },
      { id: 'bath1', name: 'Ensuite', type: 'sanitary', x: 170, y: 270, w: 50, h: 80 },
      { id: 'bed2', name: 'Bed 2', type: 'private', x: 220, y: 140, w: 120, h: 130 },
      { id: 'bed3', name: 'Bed 3', type: 'private', x: 340, y: 140, w: 120, h: 130 },
      { id: 'bath2', name: 'Common Bath', type: 'sanitary', x: 340, y: 20, w: 80, h: 80 },
      { id: 'balcony', name: 'Balcony', type: 'outdoor', x: 220, y: 270, w: 240, h: 50 },
    ],
    Premium: [
      { id: 'living', name: 'Grand Living', type: 'public', x: 20, y: 20, w: 280, h: 220 },
      { id: 'kitchen', name: 'Island Kitchen', type: 'culinary', x: 300, y: 20, w: 160, h: 150 },
      { id: 'dining', name: 'Formal Dining', type: 'public', x: 20, y: 240, w: 150, h: 120 },
      { id: 'bed1', name: 'Master Suite', type: 'private', x: 170, y: 240, w: 200, h: 180 },
      { id: 'bath1', name: 'Master Bath', type: 'sanitary', x: 370, y: 240, w: 90, h: 110 },
      { id: 'bed2', name: 'Bedroom 2', type: 'private', x: 460, y: 20, w: 160, h: 150 },
      { id: 'bath2', name: 'Bath 2', type: 'sanitary', x: 460, y: 170, w: 80, h: 80 },
      { id: 'bed3', name: 'Bedroom 3', type: 'private', x: 460, y: 250, w: 160, h: 170 },
      { id: 'balcony', name: 'Sky Deck', type: 'outdoor', x: 20, y: 360, w: 150, h: 80 },
    ]
  },
  4: {
    Premium: [
      { id: 'living', name: 'Luxury Living', type: 'public', x: 20, y: 20, w: 300, h: 250 },
      { id: 'dining', name: 'Dining Hall', type: 'public', x: 20, y: 270, w: 150, h: 150 },
      { id: 'kitchen', name: 'Chef Kitchen', type: 'culinary', x: 320, y: 20, w: 180, h: 180 },
      { id: 'bed1', name: 'Master Suite', type: 'private', x: 170, y: 270, w: 220, h: 200 },
      { id: 'bath1', name: 'Master Spa', type: 'sanitary', x: 390, y: 270, w: 110, h: 110 },
      { id: 'bed2', name: 'Bedroom 2', type: 'private', x: 500, y: 20, w: 180, h: 160 },
      { id: 'bath2', name: 'Bath 2', type: 'sanitary', x: 500, y: 180, w: 90, h: 90 },
      { id: 'bed3', name: 'Bedroom 3', type: 'private', x: 500, y: 270, w: 180, h: 160 },
      { id: 'bed4', name: 'Bedroom 4', type: 'private', x: 680, y: 20, w: 160, h: 160 },
      { id: 'bath3', name: 'Common Bath', type: 'sanitary', x: 680, y: 180, w: 90, h: 90 },
      { id: 'balcony', name: 'Panoramic Balcony', type: 'outdoor', x: 20, y: 420, w: 300, h: 80 },
    ]
  }
};

const getRoomColor = (type, isSelected) => {
  if (isSelected) return 'rgba(56, 189, 248, 0.4)'; // bright blue highlight
  switch (type) {
    case 'public': return 'rgba(30, 41, 59, 0.5)'; // living/dining
    case 'private': return 'rgba(99, 102, 241, 0.2)'; // bedrooms
    case 'culinary': return 'rgba(16, 185, 129, 0.2)'; // kitchen
    case 'sanitary': return 'rgba(148, 163, 184, 0.2)'; // bathrooms
    case 'outdoor': return 'rgba(245, 158, 11, 0.2)'; // balcony
    default: return 'rgba(30, 41, 59, 0.5)';
  }
};

export const DynamicFloorPlan = ({ property, planUsed }) => {
  const [activeTab, setActiveTab] = useState('floorplan');
  const [selectedRoom, setSelectedRoom] = useState('living');
  const [layoutVariant, setLayoutVariant] = useState(0);

  const isPremium = planUsed !== 'free';
  const priceLakhs = property?.predictedValue || 75;
  const areaSqft = property?.area || 1200;
  const bedrooms = Math.min(4, Math.max(1, parseInt(property?.bedrooms) || 2));

  // Determine Price Tier
  let priceTier = 'Compact';
  if (priceLakhs > 100) priceTier = 'Premium';
  
  // Force 4BHK to premium
  if (bedrooms >= 4) priceTier = 'Premium';

  const layoutOptions = LAYOUT_TEMPLATES[bedrooms]?.[priceTier] 
    ? [LAYOUT_TEMPLATES[bedrooms][priceTier]] 
    : [LAYOUT_TEMPLATES[bedrooms]['Compact'] || LAYOUT_TEMPLATES[2]['Compact']];

  // In premium mode, we might want to generate alternative variations
  // For demo, we just simulate by slightly tweaking positions or using same if no alternatives
  const currentLayout = layoutOptions[layoutVariant % layoutOptions.length];

  // Scale factor based on area
  // Base assumed area for layout is ~1000 sqft. If larger, we scale the SVG visually or adjust text
  const scaleRatio = Math.max(1, areaSqft / 1000);

  const selectedRoomDetails = currentLayout.find(r => r.id === selectedRoom) || currentLayout[0];

  const handleRoomClick = (id) => setSelectedRoom(id);

  const renderDisclaimer = () => (
    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <Info size={18} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>AI-GENERATED CONCEPTUAL FLOOR PLAN</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This floor plan is an AI-generated conceptual representation and should not be used as an architectural, structural, legal, or construction drawing.</div>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="section-tag">2D Property View</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>AI-Generated 2D Floor Plan</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong>{bedrooms} BHK {priceTier} Residence</strong> • 
            <span>{areaSqft} sq.ft.</span> •
            <span>Estimated Value: {formatPropertyValue(priceLakhs).replace('₹', '')}</span>
          </div>
        </div>
        <div>
          {isPremium ? (
            <span className="badge badge-ai" style={{ padding: '0.5rem 1rem' }}>✦ PREMIUM AI FLOOR PLAN</span>
          ) : (
            <span className="badge badge-demo" style={{ padding: '0.5rem 1rem' }}>STANDARD FLOOR PLAN</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-medium)', marginBottom: '1.5rem' }}>
        {['floorplan', 'property-details', 'dimensions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'floorplan' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* LEFT: Canvas */}
          <div style={{ flex: '1 1 500px', background: '#080D1A', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
            <svg viewBox="0 0 900 550" style={{ width: '100%', height: 'auto', maxHeight: '450px' }}>
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Outer boundary based on max extents */}
              <rect x="15" y="15" width="870" height="520" fill="none" stroke="#334155" strokeWidth="4" rx="2" />

              {currentLayout.map((room) => {
                const isSelected = selectedRoom === room.id;
                return (
                  <g 
                    key={room.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick(room.id)}
                  >
                    <rect 
                      x={room.x} y={room.y} 
                      width={room.w} height={room.h} 
                      fill={getRoomColor(room.type, isSelected)} 
                      stroke={isSelected ? '#38BDF8' : '#475569'} 
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text 
                      x={room.x + room.w/2} 
                      y={room.y + room.h/2} 
                      fill={isSelected ? '#FFFFFF' : '#94A3B8'} 
                      fontSize="14" 
                      fontWeight="600" 
                      textAnchor="middle"
                    >
                      {room.name.toUpperCase()}
                    </text>
                    {isPremium && (
                      <text 
                        x={room.x + room.w/2} 
                        y={room.y + room.h/2 + 20} 
                        fill={isSelected ? '#38BDF8' : '#64748B'} 
                        fontSize="11" 
                        textAnchor="middle"
                      >
                        {Math.round((room.w * room.h * scaleRatio) / 100)} sq.ft
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* RIGHT: Interaction Panel */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{selectedRoomDetails.name.toUpperCase()}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Area</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '1.1rem' }}>
                    {Math.round((selectedRoomDetails.w * selectedRoomDetails.h * scaleRatio) / 100)} sq.ft.
                  </div>
                </div>
                {isPremium && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dimensions</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {Math.round(selectedRoomDetails.w/15 * Math.sqrt(scaleRatio))}' × {Math.round(selectedRoomDetails.h/15 * Math.sqrt(scaleRatio))}'
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Features:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                  <li>Optimized {selectedRoomDetails.type} zone</li>
                  {selectedRoomDetails.type === 'private' && <li>Natural lighting provisions</li>}
                  {selectedRoomDetails.type === 'culinary' && <li>Modular layout compatible</li>}
                  {selectedRoomDetails.type === 'public' && <li>Spacious circulation path</li>}
                </ul>
              </div>
            </div>

            {isPremium ? (
              <div style={{ padding: '1.5rem', background: 'var(--bg-surface-secondary)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                  ✦ NEXAAGENT FLOOR PLAN INSIGHT
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "Based on the property's {areaSqft} sq.ft. built-up area and {bedrooms} BHK configuration, this layout prioritizes a larger living area, a dedicated space, and optimal {selectedRoomDetails.name.toLowerCase()} placement while maintaining efficient circulation."
                </p>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                <Lock size={20} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>AI Insights Locked</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upgrade to Premium for NexaAgent architectural insights, detailed room dimensions, and alternative layout options.</p>
              </div>
            )}

            {isPremium && (
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Explore Alternative Layouts</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setLayoutVariant(0)}>Family Focused</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setLayoutVariant(1)}>Maximum Space</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setLayoutVariant(2)}>Rental Optimized</button>
                </div>
              </div>
            )}
            
            {isPremium && (
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Download size={16} /> Download 2D Floor Plan
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'property-details' && (
        <div style={{ padding: '2rem', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
           <h3 style={{ marginBottom: '1rem' }}>Property Configuration</h3>
           <p style={{ color: 'var(--text-secondary)' }}>This property utilizes a {bedrooms} BHK layout with {areaSqft} sq.ft. of space.</p>
           {/* Can be expanded based on inputs */}
        </div>
      )}

      {activeTab === 'dimensions' && (
        <div style={{ padding: '2rem', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
           <h3 style={{ marginBottom: '1rem' }}>Room Dimensions Summary</h3>
           <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                 <th style={{ padding: '0.75rem 0' }}>Room</th>
                 <th style={{ padding: '0.75rem 0' }}>Type</th>
                 <th style={{ padding: '0.75rem 0' }}>Area (sq.ft)</th>
                 {isPremium && <th style={{ padding: '0.75rem 0' }}>Est. Dimensions</th>}
               </tr>
             </thead>
             <tbody>
               {currentLayout.map(room => (
                 <tr key={room.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                   <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{room.name}</td>
                   <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{room.type}</td>
                   <td style={{ padding: '0.75rem 0', color: 'var(--accent-blue)', fontWeight: 600 }}>{Math.round((room.w * room.h * scaleRatio) / 100)}</td>
                   {isPremium && <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                     {Math.round(room.w/15 * Math.sqrt(scaleRatio))}' × {Math.round(room.h/15 * Math.sqrt(scaleRatio))}'
                   </td>}
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {renderDisclaimer()}
    </div>
  );
};
