import React, { useState } from 'react';
import { Eye, CheckCircle2, ShieldCheck, Sparkles, Check } from 'lucide-react';

export const AIVision = ({ property, onVerify, defaultImage }) => {
  const [isVerified, setIsVerified] = useState(false);

  const visionData = property?.aiVision || {
    detectedType: "Modern Architecture Villa",
    exteriorCondition: "Good",
    bedroomsDetected: 3,
    parking: "Detected",
    balcony: "Detected",
    garden: "Detected",
    pool: "Not Detected",
    exteriorQuality: "High"
  };

  const handleVerify = () => {
    setIsVerified(true);
    if (onVerify) onVerify();
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span className="section-tag">Computer Vision Pipeline</span>
          <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Eye size={22} color="var(--accent-blue)" /> AI Property Vision
          </h3>
          <p style={{ fontSize: '0.88rem' }}>
            Automated architectural segmentation, structural inspection, and amenity detection from imagery.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-demo">Demo Analysis</span>
          <span className="badge badge-ai">YOLOv8 + ResNet</span>
        </div>
      </div>

      <div className="vision-split">
        {/* Left: Image with Bounding Boxes */}
        <div className="vision-image-canvas">
          <img
            src={property?.imageUrl || defaultImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
            alt="AI Vision Property Scan"
          />

          {/* Bounding Box 1: Balcony */}
          <div className="bounding-box" style={{ top: '25%', left: '20%', width: '45%', height: '28%' }}>
            <span className="bounding-box-label">Balcony Facade (98%)</span>
          </div>

          {/* Bounding Box 2: Windows */}
          <div className="bounding-box" style={{ top: '56%', left: '15%', width: '38%', height: '32%' }}>
            <span className="bounding-box-label">Glazing / Windows (96%)</span>
          </div>

          {/* Bounding Box 3: Garage / Driveway */}
          <div className="bounding-box" style={{ top: '58%', left: '56%', width: '36%', height: '36%' }}>
            <span className="bounding-box-label">Covered Parking (92%)</span>
          </div>
        </div>

        {/* Right: Detected Attributes List */}
        <div className="vision-attribute-list">
          <div className="vision-item">
            <span className="vision-label">Detected Property Type</span>
            <span className="vision-value" style={{ color: 'var(--accent-blue)' }}>{visionData.detectedType}</span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Exterior Condition</span>
            <span className="vision-value" style={{ color: 'var(--status-positive)' }}>{visionData.exteriorCondition}</span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Bedrooms Inferred</span>
            <span className="vision-value">{visionData.bedroomsDetected} Bedrooms</span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Parking Bay</span>
            <span className="vision-value" style={{ color: visionData.parking.includes("Detected") ? 'var(--status-positive)' : 'var(--text-muted)' }}>
              {visionData.parking}
            </span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Balcony</span>
            <span className="vision-value" style={{ color: visionData.balcony.includes("Detected") ? 'var(--status-positive)' : 'var(--text-muted)' }}>
              {visionData.balcony}
            </span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Garden Landscaping</span>
            <span className="vision-value" style={{ color: visionData.garden.includes("Detected") ? 'var(--status-positive)' : 'var(--text-muted)' }}>
              {visionData.garden}
            </span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Pool Feature</span>
            <span className="vision-value" style={{ color: visionData.pool.includes("Detected") ? 'var(--status-positive)' : 'var(--text-muted)' }}>
              {visionData.pool}
            </span>
          </div>

          <div className="vision-item">
            <span className="vision-label">Exterior Quality Index</span>
            <span className="vision-value" style={{ color: 'var(--accent-blue)' }}>{visionData.exteriorQuality}</span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleVerify}
              disabled={isVerified}
            >
              {isVerified ? (
                <>
                  <Check size={18} />
                  <span>AI Results Verified & Synced</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify AI Results</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
