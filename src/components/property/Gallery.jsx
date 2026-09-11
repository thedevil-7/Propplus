import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2, X } from 'lucide-react';

export const Gallery = ({ images = [], defaultImage }) => {
  const allImages = images.length > 0 ? images : [
    defaultImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="gallery-showcase">
      {/* Large Main Property Image */}
      <div className="gallery-main-view">
        <img
          src={allImages[activeIndex]}
          alt={`Property view ${activeIndex + 1}`}
          onClick={() => setIsLightboxOpen(true)}
          style={{ cursor: 'zoom-in' }}
        />

        {/* Gallery Controls Overlay */}
        <div className="gallery-controls-overlay">
          <button className="icon-button" onClick={prevSlide} title="Previous photo" aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button className="icon-button" onClick={nextSlide} title="Next photo" aria-label="Next">
            <ChevronRight size={16} />
          </button>
          <button className="icon-button" onClick={() => setIsLightboxOpen(true)} title="Zoom Fullscreen" aria-label="Zoom">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-surface-elevated)', overflowX: 'auto' }}>
          {allImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '64px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
                border: activeIndex === idx ? '2px solid var(--accent-blue)' : '2px solid transparent',
                opacity: activeIndex === idx ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 14, 26, 0.95)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="icon-button"
            style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 3010 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={20} />
          </button>
          <img
            src={allImages[activeIndex]}
            alt="Fullscreen property view"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 'var(--radius-lg)', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
