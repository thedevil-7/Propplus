import React, { useState } from 'react';

export const BarChart = ({ data = [], height = 220 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data.length) return null;

  const maxVal = Math.max(...data.map((d) => d.price || d.value || 100)) * 1.15;
  const chartHeight = height - 40;
  const barWidth = 36;
  const gap = 24;
  const svgWidth = data.length * (barWidth + gap) + 40;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${height}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((factor) => {
          const y = chartHeight - chartHeight * factor + 10;
          return (
            <line
              key={factor}
              x1="20"
              y1={y}
              x2={svgWidth - 10}
              y2={y}
              stroke="var(--border-subtle)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Bars */}
        {data.map((item, idx) => {
          const val = item.price || item.value || 0;
          const barH = (val / maxVal) * chartHeight;
          const x = 30 + idx * (barWidth + gap);
          const y = chartHeight - barH + 10;
          const isHovered = hoveredIdx === idx;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Bar Rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={isHovered ? 'url(#barGradHover)' : 'url(#barGrad)'}
                opacity={isHovered ? 1 : 0.85}
                transition="all 0.2s"
              />

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 14}
                    y={y - 28}
                    width={barWidth + 28}
                    height={22}
                    rx={4}
                    fill="#0F172A"
                    stroke="var(--accent-blue)"
                    strokeWidth="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 13}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    ₹{val}L
                  </text>
                </g>
              )}

              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 28}
                fill="var(--text-secondary)"
                fontSize="10.5"
                textAnchor="middle"
                fontWeight="500"
              >
                {item.location || item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
