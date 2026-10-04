import React, { useState } from 'react';

export const DonutChart = ({ data = [], size = 220 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data.length) return null;

  const total = data.reduce((sum, d) => sum + (d.percentage || d.value || 0), 0);
  const center = size / 2;
  const radius = size * 0.38;
  const strokeWidth = size * 0.16;

  let currentAngle = 0;

  const slices = data.map((item, idx) => {
    const val = item.percentage || item.value || 0;
    const sliceAngle = (val / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle += sliceAngle;

    // Polar to Cartesian
    const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = center + radius * Math.cos(toRad(startAngle));
    const y1 = center + radius * Math.sin(toRad(startAngle));
    const x2 = center + radius * Math.cos(toRad(endAngle));
    const y2 = center + radius * Math.sin(toRad(endAngle));
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return {
      ...item,
      pathData,
      color: item.color || '#6366F1',
      percentage: val
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : slices[0];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.pathData}
              fill="none"
              stroke={slice.color}
              strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
              strokeLinecap="round"
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s, stroke 0.2s' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {activeItem?.percentage}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '80px', textAlign: 'center' }}>
            {activeItem?.type}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {slices.map((slice, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.45,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: slice.color }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{slice.type}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>({slice.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
