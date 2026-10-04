import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Info,
  HelpCircle,
  Box,
  Layout,
  CheckCircle2,
  Maximize,
  Check,
  MapPin,
  Building2,
  Settings2,
  ShieldAlert
} from 'lucide-react';

import { AIAnalysisLoading } from '../components/property/AIAnalysisLoading';
import { AIVision } from '../components/property/AIVision';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { ReportModal } from '../components/property/ReportModal';
import { PropertyMap2D } from '../components/property/PropertyMap2D';
import { DynamicFloorPlan } from '../components/architectural/DynamicFloorPlan';
import { propertyService } from '../api/propertyService';
import { REGIONAL_LOCALITIES } from '../api/mockData';
import { fetchIndianCities, getIndianCitiesSync } from '../api/cityService';

const AMENITY_OPTIONS = [
  "Gym",
  "Swimming Pool",
  "Garden",
  "Security",
  "Lift",
  "Club House",
  "CCTV",
  "Power Backup",
  "Parking",
  "Solar",
  "Smart Home"
];

export const PredictView = ({ onPredictionComplete, setCurrentView, userRole = 'admin', credits = 3 }) => {
  // Workflow Phase: 'form' | 'loading' | 'results'
  const [phase, setPhase] = useState('form');
  const resultRef = useRef(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form State
  const [propertyType, setPropertyType] = useState('Villa');
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [locality, setLocality] = useState('C-Scheme');
  const [area, setArea] = useState('1800');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [floors, setFloors] = useState('2');
  const [age, setAge] = useState('2');
  const [parking, setParking] = useState('2');
  const [furnishing, setFurnishing] = useState('Furnished');
  const [balcony, setBalcony] = useState('Yes');
  const [selectedAmenities, setSelectedAmenities] = useState([
    "Swimming Pool", "Garden", "Security", "Smart Home", "CCTV", "Power Backup"
  ]);

  const [floorPlanFile, setFloorPlanFile] = useState(null);

  const [pricingMethod, setPricingMethod] = useState('AI_ESTIMATE'); // 'AI_ESTIMATE' or 'USER_PROVIDED'
  const [userPriceSqft, setUserPriceSqft] = useState('');

  // Errors state
  const [errors, setErrors] = useState({});

  // Indian Cities API state
  const [citiesList, setCitiesList] = useState(() => getIndianCitiesSync());
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchIndianCities().then((cities) => {
      if (active && cities && cities.length > 0) {
        setCitiesList(cities);
      }
    });
    return () => { active = false; };
  }, []);

  // Generated Prediction Result State
  const [predictionResult, setPredictionResult] = useState(null);
  
  // AI Model Selection State
  const [selectedModel, setSelectedModel] = useState('prop-fast');

  // Toggle amenity chips
  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!area || parseFloat(area) <= 0) {
      errs.area = "Area must be greater than 0 sq.ft";
    }
    if (!bedrooms || parseInt(bedrooms) < 0) {
      errs.bedrooms = "Bedrooms must be 0 or more";
    }
    if (!bathrooms || parseInt(bathrooms) < 0) {
      errs.bathrooms = "Bathrooms must be 0 or more";
    }
    if (!age || parseInt(age) < 0) {
      errs.age = "Property age must be 0 or more";
    }
    if (!location.trim()) {
      errs.location = "Location is required";
    }
    if (!locality.trim()) {
      errs.locality = "Locality is required";
    }
    
    if (pricingMethod === 'USER_PROVIDED') {
      if (!userPriceSqft || parseFloat(userPriceSqft) <= 0) {
        errs.userPriceSqft = "Please enter a valid price per sq.ft.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePredictSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (userRole === 'customer_free' && credits <= 0) {
      alert("You have run out of prediction credits for this month. Please upgrade your plan.");
      return;
    }

    // Transition to AI Analysis Scanning Phase
    setPhase('loading');
  };

  const handleLoadingFinished = async () => {
    try {
      const primaryImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
      const payload = {
        propertyType,
        location,
        locality,
        area: parseFloat(area),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        floors: parseInt(floors),
        age: parseInt(age),
        parking: parseInt(parking),
        furnishing,
        balcony: balcony === 'Yes',
        amenities: selectedAmenities,
        primaryImage: primaryImg,
        floorPlanUrl: floorPlanFile ? URL.createObjectURL(floorPlanFile) : null,
        pricingMethod,
        userPriceSqft: pricingMethod === 'USER_PROVIDED' ? parseFloat(userPriceSqft) : null,
        aiModel: selectedModel,
        userRole
      };

      const res = await propertyService.predictPrice(payload);
      setPredictionResult(res.data);
      if (onPredictionComplete) onPredictionComplete(res.data);
      setPhase('results');
      
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (e) {
      console.error(e);
      setPhase('form');
    }
  };

  const handleReset = () => {
    setPropertyType('Villa');
    setLocation('Jaipur, Rajasthan');
    setLocality('C-Scheme');
    setArea('1800');
    setBedrooms('3');
    setBathrooms('2');
    setFloors('2');
    setAge('2');
    setParking('2');
    setFurnishing('Furnished');
    setBalcony('Yes');
    setFloorPlanFile(null);
    setSelectedAmenities(["Swimming Pool", "Garden", "Security", "Smart Home"]);
    setPricingMethod('AI_ESTIMATE');
    setUserPriceSqft('');

    setErrors({});
  };

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <ReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        property={predictionResult} 
      />

      <div style={{ opacity: phase === 'loading' ? 0.7 : 1, pointerEvents: phase === 'loading' ? 'none' : 'auto' }}>

          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-tag">Machine Learning Valuation</span>
            <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', fontWeight: 800 }}>Predict Property Value</h1>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Specify architectural attributes. Our AI regression model analyzes features, comps, and locality factors to predict property value.
            </p>
          </div>

          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div className="form-card" style={{ padding: '2.5rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)', background: '#FFFFFF' }}>
              
              <form onSubmit={handlePredictSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Section: Calculation Method */}
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)' }}>
                    <Settings2 size={18} /> Calculation Method
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: pricingMethod === 'USER_PROVIDED' ? '#FFFFFF' : 'transparent', borderRadius: '8px', border: `1px solid ${pricingMethod === 'USER_PROVIDED' ? 'var(--primary-400)' : 'transparent'}`, transition: 'all 0.2s' }}>
                      <input 
                        type="radio" 
                        name="pricingMethod" 
                        value="USER_PROVIDED" 
                        checked={pricingMethod === 'USER_PROVIDED'}
                        onChange={() => setPricingMethod('USER_PROVIDED')}
                        style={{ marginTop: '0.25rem', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-600)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Enter my own price per sq.ft.</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>Calculate the total value based on a specific rate you have in mind.</p>
                        
                        {pricingMethod === 'USER_PROVIDED' && (
                          <div style={{ marginTop: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                              <input
                                type="number"
                                className={`form-input ${errors.userPriceSqft ? 'error' : ''}`}
                                value={userPriceSqft}
                                onChange={(e) => setUserPriceSqft(e.target.value)}
                                placeholder="e.g. 5500"
                                min="1"
                                style={{ maxWidth: '200px' }}
                              />
                              {errors.userPriceSqft && <span className="form-error-msg">{errors.userPriceSqft}</span>}
                            </div>
                            {area && userPriceSqft && !errors.area && parseFloat(userPriceSqft) > 0 && (
                              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: '8px', border: '1px dashed var(--primary-300)' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Live Calculation</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                                  ₹{((parseFloat(area) * parseFloat(userPriceSqft)) / 100000).toFixed(2)} Lakh
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  {area} sq.ft. × ₹{userPriceSqft} / sq.ft.
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: pricingMethod === 'AI_ESTIMATE' ? '#FFFFFF' : 'transparent', borderRadius: '8px', border: `1px solid ${pricingMethod === 'AI_ESTIMATE' ? 'var(--primary-400)' : 'transparent'}`, transition: 'all 0.2s' }}>
                      <input 
                        type="radio" 
                        name="pricingMethod" 
                        value="AI_ESTIMATE" 
                        checked={pricingMethod === 'AI_ESTIMATE'}
                        onChange={() => setPricingMethod('AI_ESTIMATE')}
                        style={{ marginTop: '0.25rem', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-600)' }}
                      />
                      <div>
                        <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Let Propluse AI estimate it</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>Our prediction model will estimate the property value based on available property and market factors.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section: Location */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <MapPin size={18} className="text-primary-500" /> Location Details
                  </h4>
                  <div className="form-grid-2col">
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>City / Region</label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <Sparkles size={12} /> {citiesList.length} Cities Available
                        </span>
                      </div>
                      <input
                        type="text"
                        list="indian-cities-list"
                        className={`form-input ${errors.location ? 'error' : ''}`}
                        value={location}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setLocation(newCity);
                          if (REGIONAL_LOCALITIES[newCity]) {
                            setLocality(REGIONAL_LOCALITIES[newCity][0]);
                          }
                        }}
                        placeholder="e.g. Jaipur, Mumbai..."
                      />
                      <datalist id="indian-cities-list">
                        {citiesList.map((c) => (
                          <option key={c.fullName} value={c.fullName}>
                            {c.city} • {c.state}
                          </option>
                        ))}
                      </datalist>
                      {errors.location && <span className="form-error-msg">{errors.location}</span>}
                      
                      <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {["Jaipur", "Mumbai", "Bengaluru", "Delhi NCR"].map((m) => (
                            <button
                              type="button"
                              key={m}
                              className={`toggle-chip ${location.toLowerCase().includes(m.toLowerCase()) ? 'active' : ''}`}
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              onClick={() => {
                                const fullLoc = ["Jaipur, Rajasthan", "Mumbai, Maharashtra", "Bengaluru, Karnataka", "Delhi NCR"].find(l => l.includes(m));
                                setLocation(fullLoc);
                                if (REGIONAL_LOCALITIES[fullLoc]) setLocality(REGIONAL_LOCALITIES[fullLoc][0]);
                              }}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ marginBottom: '0.5rem' }}>Locality / Sector</label>
                      <input
                        type="text"
                        list="localities-list"
                        className={`form-input ${errors.locality ? 'error' : ''}`}
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="e.g. C-Scheme, Bandra..."
                      />
                      <datalist id="localities-list">
                        {(REGIONAL_LOCALITIES[location] || []).map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                      {errors.locality && <span className="form-error-msg">{errors.locality}</span>}
                      
                      {REGIONAL_LOCALITIES[location] && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {REGIONAL_LOCALITIES[location].slice(0,4).map((loc) => (
                              <button
                                type="button"
                                key={loc}
                                className={`toggle-chip ${locality === loc ? 'active' : ''}`}
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                onClick={() => setLocality(loc)}
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Property Specs */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <Building2 size={18} className="text-primary-500" /> Property Specs
                  </h4>
                  
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Property Type</label>
                    <select
                      className="form-select"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      style={{ maxWidth: '300px' }}
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Carpet Area (sq.ft)</label>
                      <input
                        type="number"
                        className={`form-input ${errors.area ? 'error' : ''}`}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="1800"
                        min="1"
                      />
                      {errors.area && <span className="form-error-msg">{errors.area}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Property Age (Years)</label>
                      <input
                        type="number"
                        className={`form-input ${errors.age ? 'error' : ''}`}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="2"
                        min="0"
                      />
                      {errors.age && <span className="form-error-msg">{errors.age}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Bedrooms (BHK)</label>
                      <input
                        type="number"
                        className={`form-input ${errors.bedrooms ? 'error' : ''}`}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        placeholder="3"
                        min="0"
                      />
                      {errors.bedrooms && <span className="form-error-msg">{errors.bedrooms}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bathrooms</label>
                      <input
                        type="number"
                        className={`form-input ${errors.bathrooms ? 'error' : ''}`}
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        placeholder="2"
                        min="0"
                      />
                      {errors.bathrooms && <span className="form-error-msg">{errors.bathrooms}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Floors</label>
                      <input
                        type="number"
                        className="form-input"
                        value={floors}
                        onChange={(e) => setFloors(e.target.value)}
                        placeholder="2"
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parking Slots</label>
                      <input
                        type="number"
                        className="form-input"
                        value={parking}
                        onChange={(e) => setParking(e.target.value)}
                        placeholder="2"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Furnishing</label>
                      <select
                        className="form-select"
                        value={furnishing}
                        onChange={(e) => setFurnishing(e.target.value)}
                      >
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Balcony Attached</label>
                      <select
                        className="form-select"
                        value={balcony}
                        onChange={(e) => setBalcony(e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Amenities */}
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Amenities & Features</label>
                  <div className="amenities-chip-grid">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={amenity}
                          className={`amenity-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleAmenity(amenity)}
                          style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            background: isSelected ? 'var(--primary-600)' : 'var(--bg-surface-secondary)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                            border: `1px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-medium)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: isSelected ? 600 : 500,
                            transition: 'all 0.2s'
                          }}
                        >
                          {isSelected && <Check size={14} />}
                          <span>{amenity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section: AI Model */}
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)' }}>
                    <Sparkles size={18} /> Select Engine
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                      {
                        id: "prop-fast",
                        name: "PropPulse Fast",
                        badge: "Free",
                        desc: "Standard regression model for quick estimates."
                      },
                      {
                        id: "prop-pro",
                        name: "PropPulse Pro",
                        badge: "Premium",
                        desc: "Advanced XGBoost with Neural Vision processing."
                      }
                    ].map(model => {
                      const isPremium = model.badge === 'Premium';
                      const isLocked = isPremium && userRole === 'customer_free';
                      return (
                      <div
                        key={model.id}
                        onClick={() => {
                          if (isLocked) {
                            alert("You need a premium subscription or admin access to use this model.");
                            return;
                          }
                          setSelectedModel(model.id);
                        }}
                        style={{
                          border: `2px solid ${selectedModel === model.id ? 'var(--primary-500)' : 'var(--border-medium)'}`,
                          borderRadius: '10px',
                          padding: '1.25rem',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          background: selectedModel === model.id ? 'rgba(65, 105, 225, 0.05)' : (isLocked ? 'var(--bg-surface)' : '#FFFFFF'),
                          transition: 'all 0.2s ease',
                          opacity: isLocked ? 0.6 : 1,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {selectedModel === model.id && (
                          <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: 'var(--primary-500)' }} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {model.name} {isLocked && <ShieldAlert size={14} className="text-secondary" />}
                          </span>
                          <span className={model.badge === 'Free' ? 'badge badge-positive' : 'badge stitch-pill-royal'} style={{ fontSize: '0.7rem' }}>
                            {model.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{model.desc}</p>
                      </div>
                    )})}
                  </div>
                </div>

                {/* Section: Floor Plan Upload */}
                <div className="form-group" style={{ padding: '1.5rem', border: '1px dashed var(--border-medium)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
                  <label className="form-label" style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Upload 2D Floor Plan (Optional)</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Enhance prediction accuracy by uploading a floor plan. Supported formats: JPG, PNG, WebP, PDF</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="form-input"
                    style={{ background: '#FFFFFF', padding: '0.5rem' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFloorPlanFile(e.target.files[0]);
                      }
                    }}
                  />
                  {floorPlanFile && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                      <CheckCircle2 size={16} /> Selected: {floorPlanFile.name}
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" disabled={phase === 'loading'} className="btn btn-primary btn-lg" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '8px' }}>
                    <Sparkles size={20} />
                    <span>{phase === 'loading' ? 'Analyzing Property...' : 'Predict Property Value'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                    title="Reset Form Fields"
                    style={{ padding: '0 1.5rem', borderRadius: '8px' }}
                  >
                    <RotateCcw size={18} />
                    <span className="hide-mobile">Reset</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>

      <div ref={resultRef} style={{ minHeight: phase !== 'form' ? '400px' : '0' }}>
        {phase === 'loading' && (
          <div style={{ marginTop: '3rem' }}>
            <AIAnalysisLoading onComplete={handleLoadingFinished} />
          </div>
        )}

      {/* RESULTS PHASE */}
      {phase === 'results' && predictionResult && (
        <div>
          {/* Top Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge stitch-pill-royal" style={{ marginBottom: '0.5rem' }}>AI Valuation Output</span>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800 }}>{predictionResult.title}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{predictionResult.location} &bull; {predictionResult.locality}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPhase('form')}
              >
                <RotateCcw size={16} />
                <span>Adjust Parameters</span>
              </button>
            </div>
          </div>

          {/* MAIN PRICE PREDICTION HERO CARD */}
          <div className="result-hero-card" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className={`badge ${predictionResult.pricingMethod === 'USER_PROVIDED' ? 'badge-positive' : 'stitch-pill-royal'}`} style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
              {predictionResult.pricingMethod === 'USER_PROVIDED' ? '🟢 User-Provided Rate' : `🔵 Propluse AI Estimate • Confidence ${predictionResult.aiScore}%`}
            </span>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Estimated Property Value
            </div>

            <div className="result-main-price" style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1.1, marginBottom: '1rem' }}>
              ₹{predictionResult.predictedValue?.toFixed(2)} <span style={{ fontSize: '2.25rem', color: 'var(--primary-500)' }}>Lakhs</span>
            </div>
            
            {predictionResult.planUsed === 'free' && (
              <div style={{ margin: '1rem 0 2rem', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '8px' }}>
                <span className="badge" style={{ background: '#FFD700', color: '#856404', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>FREE ESTIMATE</span>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Upgrade to Premium for detailed insights, tighter valuation ranges, and higher confidence.</p>
              </div>
            )}

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              {predictionResult.pricingMethod === 'USER_PROVIDED' 
                ? 'Your calculation is based on the price per sq.ft. you entered.'
                : 'Estimated using property characteristics and the Propluse prediction model.'}
            </p>

            {/* How is this calculated? */}
            {predictionResult.pricingMethod === 'USER_PROVIDED' && (
              <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', maxWidth: '500px', margin: '0 auto 1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-700)' }}>How is this calculated?</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Property Value<br/>
                  = Property Area × Price per sq.ft.<br/>
                  = {predictionResult.area} × ₹{predictionResult.userPriceSqft}<br/>
                  = ₹{(predictionResult.area * predictionResult.userPriceSqft).toLocaleString()}
                </div>
              </div>
            )}

            {/* Estimated Price Range Indicator */}
            {predictionResult.pricingMethod !== 'USER_PROVIDED' && (
              <div className="price-range-bar-wrap" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="range-labels-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Lower Bound: ₹{predictionResult.priceRange[0]}L</span>
                  <span>Upper Bound: ₹{predictionResult.priceRange[1]}L</span>
                </div>
                <div className="range-gradient-track" style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                  <div className="range-gradient-fill" style={{ position: 'absolute', top: 0, left: predictionResult.planUsed === 'free' ? '10%' : '20%', right: predictionResult.planUsed === 'free' ? '10%' : '20%', height: '100%', background: 'linear-gradient(90deg, var(--primary-300), var(--primary-600))', borderRadius: '4px' }} />
                  <div className="range-marker-pin" title={`Median Valuation: ₹${predictionResult.predictedValue}L`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#FFFFFF', border: '3px solid var(--primary-600)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                  {predictionResult.planUsed === 'free' ? '75% Confidence Valuation Band (Free Version)' : '95% Confidence Valuation Band'} (₹{predictionResult.priceRange[0]}L — ₹{predictionResult.priceRange[1]}L)
                </div>
              </div>
            )}
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2rem', fontStyle: 'italic', maxWidth: '700px', margin: '2rem auto 0' }}>
              {predictionResult.pricingMethod === 'USER_PROVIDED'
                ? 'This calculation uses the price per sq.ft. entered by you and is not an independent market valuation.'
                : 'This value is an estimate generated by the Propluse prediction model and should not be treated as a guaranteed selling or purchase price.'
              }
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setShowReportModal(true)} className="btn btn-primary btn-lg" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Download Valuation Report
              </button>
              <button className="btn btn-secondary btn-lg" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Save Valuation
              </button>
            </div>
          </div>

          <PropertyMap2D property={predictionResult} planUsed={predictionResult.planUsed} />

          {/* 2D Property Floor Plan (New AI feature) */}
          <DynamicFloorPlan property={predictionResult} planUsed={predictionResult.planUsed} />

          {/* Comparison Delta Cards / Lock screen */}
          <div className="comparison-deltas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {predictionResult.planUsed === 'free' ? (
              <div className="card" style={{ padding: '2rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px', gridColumn: '1 / -1' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Want deeper analysis?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔒</span> <span>24 Comparable Properties</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔒</span> <span>3-Year Price History</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔒</span> <span>Micro-Locality Analysis</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔒</span> <span>Detailed AI Explanation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔒</span> <span>Detailed Valuation Report</span>
                  </div>
                </div>
                <button onClick={() => setCurrentView('pricing')} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-gold)', color: '#000', borderColor: 'var(--accent-gold)' }}>
                  <span style={{ fontSize: '1.1rem' }}>✦</span> Upgrade to Premium
                </button>
              </div>
            ) : (
              <>
                {/* Premium details shown to premium users */}
                <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px', gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-600)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
                      Market Data
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li>✓ 24 Comparable Properties</li>
                      <li>✓ 3-Year Price History</li>
                      <li>✓ Micro-Locality Analysis</li>
                    </ul>
                  </div>

                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-600)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
                      Premium Analysis
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li>✓ Detailed AI Explanation</li>
                      <li>✓ 95% Confidence Band</li>
                      <li>✓ Price/sq.ft. Insights</li>
                    </ul>
                  </div>

                  <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <button onClick={() => setShowReportModal(true)} className="btn btn-secondary" style={{ width: '100%', maxWidth: '250px' }}>Download Valuation Report</button>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* PAGE 5: AI PROPERTY VISION SCAN (Only for Premium/Admin) */}
          {predictionResult.planUsed !== 'free' && (
            <AIVision
              property={predictionResult}
              defaultImage={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
              onVerify={() => {}}
            />
          )}

          {/* PAGE 10: EXPLAINABLE AI (XAI) FEATURE IMPORTANCE CHART (Only for Premium/Admin) */}
          {predictionResult.planUsed !== 'free' && (
            <div style={{ marginTop: '3rem' }}>
              <FeatureImportanceChart />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setCurrentView('properties')}
              style={{ padding: '1rem 2rem', fontSize: '1.05rem', borderRadius: '8px' }}
            >
              <Layout size={18} />
              <span>View All Properties</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

