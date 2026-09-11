import React, { useState } from 'react';

export const LineChart = ({ data = [], isArea = false, height = 220, unit = "₹" }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data.length) return null;

  const values = data.map((d) => d.price || d.rate || d.value || 0);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 500;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, idx) => {
    const val = d.price || d.rate || d.value || 0;
    const x = paddingX + (idx / (data.length - 1)) * chartW;
    const y = paddingY + chartH - ((val - minVal) / range) * chartH;
    return { x, y, val, label: d.year || d.period || d.label };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${paddingY + chartH} L ${points[0].x},${paddingY + chartH} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((f) => {
          const y = paddingY + chartH * f;
          return (
            <line
              key={f}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="var(--border-subtle)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Area fill */}
        {isArea && (
          <path d={areaD} fill="url(#areaGradient)" />
        )}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points & Hover */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === i ? 6 : 4}
              fill="#FFFFFF"
              stroke="var(--primary-600)"
              strokeWidth="2.5"
              style={{ cursor: 'pointer', transition: 'r 0.2s' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* X label */}
            <text
              x={pt.x}
              y={height - 4}
              fill="var(--text-secondary)"
              fontSize="10"
              textAnchor="middle"
            >
              {pt.label}
            </text>

            {hoveredPoint === i && (
              <g>
                <rect
                  x={pt.x - 30}
                  y={pt.y - 30}
                  width={60}
                  height={22}
                  rx={4}
                  fill="#0F172A"
                  stroke="var(--accent-blue)"
                  strokeWidth="1"
                />
                <text
                  x={pt.x}
                  y={pt.y - 15}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {unit}{pt.val}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
