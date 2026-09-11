import React, { useState } from 'react';
import { DEMO_PROPERTIES } from '../api/mockData';
import { Box, Sparkles, Check, ArrowRight } from 'lucide-react';

export const ComparisonView = ({ onOpen3D, onSelectProperty }) => {
  const [selectedProps, setSelectedProps] = useState(DEMO_PROPERTIES.slice(0, 3));

  const features = [
    { label: "Predicted Price", key: "predictedValue", format: (v) => `₹${v}L` },
    { label: "Carpet Area (sq.ft)", key: "area", format: (v) => `${v} sq.ft` },
    { label: "Configuration (BHK)", key: "bedrooms", format: (v) => `${v} BHK` },
    { label: "Bathrooms", key: "bathrooms", format: (v) => `${v} Baths` },
    { label: "Location", key: "location", format: (v) => v },
    { label: "Micro Locality", key: "locality", format: (v) => v },
    { label: "Price / sq.ft", key: "pricePerSqFt", format: (v) => `₹${v?.toLocaleString()}` },
    { label: "AI Valuation Score", key: "aiScore", format: (v) => `${v}% Confidence` },
    { label: "Furnishing Status", key: "furnishing", format: (v) => v },
    { label: "Covered Parking", key: "parking", format: (v) => `${v} Slots` }
  ];

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div className="section-header">
        <span className="section-tag">Cross-Asset Benchmarking</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Compare Properties</h1>
        <p className="section-desc">
          Side-by-side comparative matrix evaluating pricing efficiency, square footage, and AI scores across top assets.
        </p>
      </div>

      {/* Property Cards Preview Row with 3D button */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedProps.length}, 1fr)`, gap: '1.5rem', marginBottom: '1.5rem' }}>
        {selectedProps.map((p, idx) => (
          <div key={p.id} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
              Property {String.fromCharCode(65 + idx)}
            </div>
            <h4 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.5rem' }}>
              {p.title}
            </h4>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              ₹{p.predictedValue}L
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpen3D && onOpen3D(p)}
                title="Open 3D Model"
              >
                <Box size={14} color="var(--accent-blue)" />
                <span>3D View</span>
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onSelectProperty && onSelectProperty(p)}
              >
                <span>Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Feature</th>
              {selectedProps.map((p, idx) => (
                <th key={p.id}>
                  Property {String.fromCharCode(65 + idx)} ({p.locality})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, rowIdx) => (
              <tr key={rowIdx}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {f.label}
                </td>
                {selectedProps.map((p) => {
                  const raw = p[f.key];
                  const formatted = f.format ? f.format(raw) : raw;
                  const isHighlight = f.key === 'predictedValue';

                  return (
                    <td
                      key={p.id}
                      style={{
                        fontWeight: isHighlight ? 800 : 500,
                        fontSize: isHighlight ? '1.1rem' : '0.92rem',
                        color: isHighlight ? 'var(--accent-blue)' : 'var(--text-primary)'
                      }}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
