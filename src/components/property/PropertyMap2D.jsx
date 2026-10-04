import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Maximize2, Layers, MapPin, Building2, Eye, ShieldAlert } from 'lucide-react';
import { DEMO_PROPERTIES } from '../../api/mockData';
import { formatPropertyValue } from '../../utils/formatters';

// Price categorization logic
const getPropertyPriceCategory = (priceLakhs, localAvgLakhs) => {
  if (!priceLakhs) return { color: '#94a3b8', label: 'Unknown', size: 24, class: 'unknown' };
  
  if (priceLakhs < 100) return { color: '#10B981', label: 'Lower Price (< 100 Lakhs)', size: 24, class: 'low' }; // Green
  if (priceLakhs >= 100 && priceLakhs < 200) return { color: '#3B82F6', label: 'Mid Price (100 - 200 Lakhs)', size: 28, class: 'mid' }; // Blue
  if (priceLakhs >= 200 && priceLakhs < 500) return { color: '#8B5CF6', label: 'Premium (200 - 500 Lakhs)', size: 32, class: 'premium' }; // Purple
  if (priceLakhs >= 500 && priceLakhs < 1000) return { color: '#F97316', label: 'High-End (500 - 1000 Lakhs)', size: 36, class: 'high' }; // Orange
  return { color: '#EF4444', label: 'Ultra-Luxury (1000+ Lakhs)', size: 40, class: 'ultra' }; // Red
};

// House SVG Icon Component
const HouseIcon = ({ size, color, isSubject = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    stroke={isSubject ? '#FFFFFF' : 'none'} 
    strokeWidth={isSubject ? '1.5' : '0'}
    style={{ 
      filter: isSubject ? `drop-shadow(0 0 8px ${color})` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      transition: 'transform 0.2s, filter 0.2s',
      cursor: 'pointer'
    }}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const PropertyMap2D = ({ property, planUsed = 'free' }) => {
  const [mapMode, setMapMode] = useState('price'); // 'price' or 'sqft'
  const [radius, setRadius] = useState(1); // 1km
  const [selectedProp, setSelectedProp] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [propTypeFilter, setPropTypeFilter] = useState('All');
  const [bhkFilter, setBhkFilter] = useState('All');

  const subjectPrice = property.predictedValue || 135;
  const subjectSqft = property.area || 1850;
  const subjectPriceSqft = (subjectPrice * 100000) / subjectSqft;
  const isPremium = planUsed !== 'free';

  // Generate comparable properties mock data for the map based on real mockData
  const comparables = useMemo(() => {
    let sourceComps = DEMO_PROPERTIES.filter(p => p.locality === property.locality || p.location === property.location);
    if (sourceComps.length === 0) sourceComps = DEMO_PROPERTIES;
    
    // Duplicate some to make up the numbers required for visual density
    while (sourceComps.length < 30) {
      sourceComps = [...sourceComps, ...sourceComps.map(p => ({...p, id: p.id + '-' + Math.random()}))];
    }
    
    const numComps = isPremium ? 28 : 5;
    const comps = [];
    const baseLat = 50; // Center map (percentage)
    const baseLng = 50;

    for (let i = 0; i < Math.min(numComps, sourceComps.length); i++) {
      const sourceProp = sourceComps[i];
      // Random spread based on radius
      const r = Math.random() * (radius * 40); // px spread
      const theta = Math.random() * 2 * Math.PI;
      const dx = r * Math.cos(theta);
      const dy = r * Math.sin(theta);
      
      comps.push({
        id: `comp-${sourceProp.id}-${i}`,
        priceLakhs: sourceProp.predictedValue || 50,
        pricePerSqFt: sourceProp.pricePerSqFt || 3000,
        area: sourceProp.area,
        bedrooms: sourceProp.bedrooms,
        type: sourceProp.type,
        distance: (r / 40).toFixed(1), // mock km
        lat: baseLat + dy,
        lng: baseLng + dx,
      });
    }
    return comps;
  }, [property, radius, isPremium]);

  // Filter properties
  const visibleProps = useMemo(() => {
    return comparables.filter(p => {
      if (propTypeFilter !== 'All' && p.type !== propTypeFilter) return false;
      if (bhkFilter !== 'All' && p.bedrooms !== parseInt(bhkFilter)) return false;
      return true;
    });
  }, [comparables, propTypeFilter, bhkFilter]);

  // Calculations for market panel
  const avgValue = visibleProps.length ? visibleProps.reduce((sum, p) => sum + p.priceLakhs, 0) / visibleProps.length : 0;
  const avgSqft = visibleProps.length ? visibleProps.reduce((sum, p) => sum + p.pricePerSqFt, 0) / visibleProps.length : 0;

  const subjectCat = getPropertyPriceCategory(mapMode === 'price' ? subjectPrice : subjectPriceSqft / 100, avgValue);

  return (
    <div style={{ marginTop: '3rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MapPin size={24} color="var(--primary-600)" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Property Location & Value Map</h2>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Main Map Container */}
        <div style={{ flex: '1 1 600px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-medium)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
          
          {/* Map Filters Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type:</span>
              <select value={propTypeFilter} onChange={e => setPropTypeFilter(e.target.value)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}>
                <option value="All">All</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>BHK:</span>
              <select value={bhkFilter} onChange={e => setBhkFilter(e.target.value)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}>
                <option value="All">All</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Radius:</span>
              <select value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}>
                <option value={0.5}>500 m</option>
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mode:</span>
              <select value={mapMode} onChange={e => setMapMode(e.target.value)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}>
                <option value="price">Total Price</option>
                <option value="sqft">Price / sq.ft.</option>
              </select>
            </div>
          </div>

          {/* Interactive Map Area */}
          <div style={{ position: 'relative', height: '450px', background: showHeatmap ? 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, rgba(249,115,22,0.05) 40%, rgba(243,244,246,1) 80%)' : '#f3f4f6', overflow: 'hidden' }}>
            
            {/* Grid background */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }} />

            {/* Render Comparable Markers */}
            {visibleProps.map(p => {
              const val = mapMode === 'price' ? p.priceLakhs : (p.pricePerSqFt / 100);
              const cat = getPropertyPriceCategory(val, avgValue);
              const isHovered = selectedProp?.id === p.id;
              
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProp(p)}
                  style={{ 
                    position: 'absolute', 
                    top: `${p.lat}%`, 
                    left: `${p.lng}%`, 
                    transform: `translate(-50%, -100%) scale(${isHovered ? 1.2 : 1})`,
                    zIndex: isHovered ? 10 : 5,
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  title={`₹${p.priceLakhs.toFixed(2)}L • ${p.bedrooms} BHK`}
                >
                  <HouseIcon size={cat.size} color={cat.color} />
                  {isHovered && (
                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', whiteSpace: 'nowrap', marginTop: '4px' }}>
                      {mapMode === 'price' ? formatPropertyValue(p.priceLakhs) : '₹' + Math.round(p.pricePerSqFt) + '/sqft'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render Subject Property (Center) */}
            <div 
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => setSelectedProp({ id: 'subject', isSubject: true, ...property })}
            >
              <div style={{ background: 'var(--primary-600)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', marginBottom: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>YOUR PROPERTY</div>
              <HouseIcon size={44} color={subjectCat.color} isSubject={true} />
              <div style={{ background: '#fff', color: '#333', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${subjectCat.color}`, marginTop: '4px' }}>
                {formatPropertyValue(subjectPrice)}
              </div>
            </div>

            {/* Selected Property Popup Card */}
            {selectedProp && (
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#FFFFFF', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--border-medium)', width: '220px', zIndex: 30 }}>
                <button onClick={() => setSelectedProp(null)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {selectedProp.isSubject ? 'YOUR PROPERTY' : `PROPERTY #${selectedProp.id.split('-')[1].padStart(3, '0')}`}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  ₹{formatPropertyValue(selectedProp.priceLakhs || selectedProp.predictedValue).replace('₹', '')}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>{selectedProp.bedrooms || property.bedrooms} BHK</span> • 
                  <span>{selectedProp.area} sq.ft.</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  ₹{Math.round(selectedProp.pricePerSqFt || subjectPriceSqft)}/sq.ft.
                </div>
                {!selectedProp.isSubject && (
                  <>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <strong>{selectedProp.distance} km</strong> from your property
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem' }}>Compare</button>
                  </>
                )}
              </div>
            )}
            
            {/* Heatmap Toggle */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#FFF', borderRadius: '8px', padding: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="heatmap-toggle" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)} />
              <label htmlFor="heatmap-toggle" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>Price Heatmap</label>
            </div>
            
            {/* Free Tier Lock Overlay */}
            {!isPremium && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', padding: '0.5rem 0.75rem', border: '1px solid var(--accent-gold)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>+23 more comparables locked (Free Plan)</span>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', background: '#FFFFFF', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: '0.5rem' }}>PROPERTY PRICE:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%' }}></div> &lt; ₹1Cr</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '50%' }}></div> ₹1Cr–₹2Cr</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#8B5CF6', borderRadius: '50%' }}></div> ₹2Cr–₹5Cr</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#F97316', borderRadius: '50%' }}></div> ₹5Cr–₹10Cr</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#EF4444', borderRadius: '50%' }}></div> ₹1000+ Lakhs</div>
          </div>
        </div>

        {/* Market Analysis Panel */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-medium)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--text-primary)' }}>LOCAL MARKET</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Property Value</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{avgValue ? avgValue.toFixed(2) : '--'} L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average ₹/sq.ft.</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{avgSqft ? Math.round(avgSqft) : '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Properties Analyzed</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{comparables.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Property</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{formatPropertyValue(subjectPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Market Position</span>
                <span style={{ fontWeight: 700, color: subjectPrice > avgValue ? 'var(--accent-teal)' : 'var(--accent-orange)' }}>
                  {subjectPrice > avgValue ? 'Above Average' : 'Below Average'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', borderRadius: '12px', border: '1px solid var(--primary-300)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✦ NEXAAGENT MAP INSIGHT
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--primary-900)', lineHeight: 1.5, margin: 0 }}>
              {isPremium ? (
                `Your property is positioned within the ${subjectCat.label.split(' ')[0]} segment of this locality. ${visibleProps.filter(p => p.pricePerSqFt > subjectPriceSqft).length} comparable properties within ${radius}km have a higher price per sq.ft., while ${visibleProps.filter(p => p.pricePerSqFt <= subjectPriceSqft).length} properties are priced lower.`
              ) : (
                "Your property valuation is positioned within the local market range. Unlock Premium to view exact market comparisons, deeper AI insights, and micro-locality pricing trends."
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
