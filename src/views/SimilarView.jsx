import React, { useState } from 'react';
import { DEMO_PROPERTIES } from '../api/mockData';
import { PropertyCard } from '../components/property/PropertyCard';
import { Filter, Search } from 'lucide-react';

export const SimilarView = ({ onSelectProperty, onOpen3D }) => {
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = DEMO_PROPERTIES.filter((p) => {
    const matchesType = filterType === 'All' || p.type === filterType;
    const matchesCity = filterCity === 'All' || p.location.toLowerCase().includes(filterCity.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCity && matchesSearch;
  });

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div className="section-header">
        <span className="section-tag">Market Comps</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Similar Properties</h1>
        <p className="section-desc">
          Properties sharing matching architectural typology, square footage, and micro-market location parameters across Jaipur, Jodhpur, and Kota.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by property, locality (Shastri Nagar, Talwandi, C-Scheme)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Jaipur', 'Jodhpur', 'Kota'].map((c) => (
            <button
              key={c}
              className={`toggle-chip ${filterCity === c ? 'active' : ''}`}
              onClick={() => setFilterCity(c)}
            >
              {c === 'All' ? 'All Cities' : c}
            </button>
          ))}
        </div>

        {/* Typology Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Villa', 'Apartment', 'Independent House'].map((t) => (
            <button
              key={t}
              className={`toggle-chip ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Property Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((prop) => (
          <PropertyCard
            key={prop.id}
            property={prop}
            onSelectProperty={onSelectProperty}
            onOpen3D={onOpen3D}
            show3DButton={true}
          />
        ))}
      </div>
    </div>
  );
};
