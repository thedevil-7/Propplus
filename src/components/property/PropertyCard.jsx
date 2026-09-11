import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize, Heart, Box, ArrowUpRight } from 'lucide-react';

export const PropertyCard = ({
  property,
  onSelectProperty,
  onOpen3D,
  show3DButton = true
}) => {
  const [isFav, setIsFav] = useState(property?.isFavorite || false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <div
      className="property-card"
      onClick={() => onSelectProperty && onSelectProperty(property)}
      style={{ cursor: 'pointer' }}
    >
      {/* Property Image & Overlays */}
      <div className="property-card-image-wrap">
        <img
          src={property?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={property?.title || "Property"}
          className="property-card-image"
          loading="lazy"
        />

        <div className="card-top-badges">
          <span className="badge badge-ai">
            AI Score {property?.aiScore || 89}%
          </span>
          <button
            className="favorite-btn"
            onClick={toggleFavorite}
            aria-label="Add to favorites"
          >
            <Heart size={15} fill={isFav ? '#F43F5E' : 'none'} color={isFav ? '#F43F5E' : '#FFFFFF'} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="property-card-body">
        <div className="property-card-location">
          <MapPin size={13} color="var(--accent-blue)" />
          <span>{property?.location || "Jaipur, Rajasthan"} &bull; {property?.locality || "C-Scheme"}</span>
        </div>

        <h4 className="property-card-title">{property?.title || "Contemporary 3 BHK Villa"}</h4>

        {/* Specs Row */}
        <div className="property-specs-row">
          <div className="spec-item">
            <Maximize size={13} color="var(--text-muted)" />
            <span>{property?.area || 1800} sq.ft</span>
          </div>
          <div className="spec-item">
            <Bed size={13} color="var(--text-muted)" />
            <span>{property?.bedrooms || 3} Beds</span>
          </div>
          <div className="spec-item">
            <Bath size={13} color="var(--text-muted)" />
            <span>{property?.bathrooms || 2} Baths</span>
          </div>
        </div>

        {/* Footer with Price & Actions */}
        <div className="property-card-footer">
          <div>
            <div className="property-card-price">
              ₹{property?.predictedValue?.toFixed(1) || "72.5"}L
            </div>
            <div className="property-card-psqft">
              ₹{property?.pricePerSqFt?.toLocaleString() || "4,028"} / sq.ft
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {show3DButton && onOpen3D && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen3D(property);
                }}
                title="Open Interactive 3D Model"
              >
                <Box size={14} color="var(--accent-blue)" />
                <span>3D</span>
              </button>
            )}

            <button
              className="icon-button"
              style={{ width: '32px', height: '32px' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty && onSelectProperty(property);
              }}
              aria-label="View Details"
            >
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
