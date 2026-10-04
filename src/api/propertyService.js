// ============================================================================
// PropPulse — Backend-Ready API Service Client
// ============================================================================
// Designed to connect to real microservices (FastAPI / Express / Flask)
// Currently simulates network latency and returns structured model responses.

import {
  DEMO_PROPERTIES,
  KPI_DATA,
  FEATURE_IMPORTANCE,
  MODEL_METRICS,
  MARKET_INSIGHTS
} from './mockData';

// In-memory prediction history stored in localStorage if available
const STORAGE_KEY = "proppulse_prediction_history";

const planFeatures = {
  free: {
    maxComparables: 3,
    historicalYears: 1,
    detailedAnalysis: false,
    detailedReport: false,
    maxComparisons: 2
  },
  premium: {
    maxComparables: 24,
    historicalYears: 3,
    detailedAnalysis: true,
    detailedReport: true,
    maxComparisons: 5
  }
};

const getSavedHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure any new demo properties (like Jodhpur/Kota) are merged
      const existingIds = new Set(parsed.map(p => p.id));
      const missingDemo = DEMO_PROPERTIES.filter(p => !existingIds.has(p.id));
      if (missingDemo.length > 0) {
        const merged = [...parsed, ...missingDemo];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Storage read error", e);
  }
  return DEMO_PROPERTIES;
};

const persistHistory = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Storage write error, attempting quota recovery", e);
    try {
      // If quota exceeded, trim older items and keep latest 30 records
      const trimmed = list.slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (retryError) {
      console.warn("Storage quota recovery failed", retryError);
    }
  }
};

export const propertyService = {
  /**
   * POST /api/predict
   * Calculates property valuation based on inputs and features
   */
  predictPrice: async (propertyData) => {
    // Simulated asynchronous latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Determine Prediction Mode
    const isFree = propertyData.userRole === 'customer_free' || propertyData.userRole === 'guest';
    const predictionMode = isFree ? "FREE_VALUATION" : "PREMIUM_VALUATION";
    const plan = isFree ? 'free' : 'premium';

    // Strict input sanitization and boundary clamping
    const parsedArea = parseFloat(propertyData.area);
    const area = (!isNaN(parsedArea) && parsedArea > 0) ? Math.min(100000, parsedArea) : 1800;
    const cleanLocation = String(propertyData.location || "Jaipur, Rajasthan").trim().slice(0, 120);
    const cleanLocality = String(propertyData.locality || "C-Scheme").trim().slice(0, 120);
    const cleanType = String(propertyData.propertyType || "Villa").trim().slice(0, 60);
    const cleanFurnishing = ["Furnished", "Semi-Furnished", "Unfurnished"].includes(propertyData.furnishing)
      ? propertyData.furnishing
      : "Furnished";

    const bedrooms = Math.max(0, Math.min(25, parseInt(propertyData.bedrooms, 10) || 3));
    const bathrooms = Math.max(0, Math.min(25, parseInt(propertyData.bathrooms, 10) || 2));
    const floors = Math.max(1, Math.min(50, parseInt(propertyData.floors, 10) || 2));
    const age = Math.max(0, Math.min(100, parseInt(propertyData.age, 10) || 1));
    const parking = Math.max(0, Math.min(50, parseInt(propertyData.parking, 10) || 2));

    const locLower = cleanLocation.toLowerCase();
    const localityLower = cleanLocality.toLowerCase();

    let calculatedRate;
    let totalValueLakhs;
    let localAvgVal;
    let localAvgRate;
    let lowBound;
    let highBound;
    let confidenceLevel;
    let aiScore;
    let pricingMethod = propertyData.pricingMethod || "AI_ESTIMATE";
    
    let debugInfo = { predictionMode };


    // ==========================================
    // UNIFIED BASE VALUATION
    // ==========================================
    let cityBase = 3800; 
    // Detailed City & Micro-Locality Parsing
    if (locLower.includes("mumbai") || locLower.includes("thane") || locLower.includes("navi mumbai")) {
      cityBase = 18500;
      if (localityLower.includes("bandra") || localityLower.includes("worli") || localityLower.includes("juhu")) cityBase += 8500;
      else if (localityLower.includes("andheri") || localityLower.includes("powai")) cityBase += 3500;
    } else if (locLower.includes("delhi") || locLower.includes("gurugram") || locLower.includes("noida") || locLower.includes("ncr")) {
      cityBase = 11500;
      if (localityLower.includes("golf") || localityLower.includes("cyber") || localityLower.includes("connaught")) cityBase += 4500;
      else if (localityLower.includes("hauz") || localityLower.includes("saket")) cityBase += 2500;
    } else if (locLower.includes("bengaluru") || locLower.includes("bangalore")) {
      cityBase = 9800;
      if (localityLower.includes("indiranagar") || localityLower.includes("koramangala")) cityBase += 3200;
      else if (localityLower.includes("whitefield") || localityLower.includes("hsr")) cityBase += 1500;
    } else if (locLower.includes("hyderabad")) {
      cityBase = 8400;
      if (localityLower.includes("jubilee") || localityLower.includes("banjara")) cityBase += 3500;
      else if (localityLower.includes("hitec") || localityLower.includes("gachibowli")) cityBase += 1800;
    } else if (locLower.includes("pune")) {
      cityBase = 7600;
      if (localityLower.includes("koregaon") || localityLower.includes("baner")) cityBase += 2000;
      else if (localityLower.includes("wakad") || localityLower.includes("hinjawadi")) cityBase += 1000;
    } else if (locLower.includes("chennai")) {
      cityBase = 7400;
      if (localityLower.includes("adyar") || localityLower.includes("boat club")) cityBase += 3000;
    } else if (locLower.includes("kolkata")) {
      cityBase = 6200;
      if (localityLower.includes("alipore") || localityLower.includes("ballygunge")) cityBase += 2500;
    } else if (locLower.includes("ahmedabad") || locLower.includes("gandhinagar") || locLower.includes("surat")) {
      cityBase = 5800;
      if (localityLower.includes("bodakdev") || localityLower.includes("sg highway")) cityBase += 1500;
    } else if (locLower.includes("jodhpur")) {
      cityBase = 3200;
      if (localityLower.includes("shastri")) cityBase += 160;
      else if (localityLower.includes("sardar")) cityBase += 190;
      else if (localityLower.includes("ratanada")) cityBase += 140;
      else if (localityLower.includes("paota")) cityBase -= 100;
    } else if (locLower.includes("kota")) {
      cityBase = 2680;
      if (localityLower.includes("talwandi")) cityBase += 150;
      else if (localityLower.includes("vigyan")) cityBase += 120;
      else if (localityLower.includes("rajiv")) cityBase += 100;
      else if (localityLower.includes("kunhari")) cityBase += 50;
    } else if (locLower.includes("jaipur")) {
      cityBase = 3900;
      if (localityLower.includes("c-scheme") || localityLower.includes("c scheme")) cityBase += 250;
      else if (localityLower.includes("malviya")) cityBase += 100;
      else if (localityLower.includes("vaishali")) cityBase += 100;
      else if (localityLower.includes("mansarovar")) cityBase -= 150;
    }
    
    const amenitiesBonus = (propertyData.amenities?.length || 4) * 0.45;
    
    if (pricingMethod === "USER_PROVIDED" && propertyData.userPriceSqft) {
       const userRate = parseFloat(propertyData.userPriceSqft);
       calculatedRate = Math.round((userRate * 0.7) + (cityBase * 0.3));
    } else {
       pricingMethod = "AI_ESTIMATE";
       calculatedRate = Math.round(cityBase + (bedrooms * 35) + (bathrooms * 25));
    }
    
    let baseTotalValueLakhs = Number(((area * calculatedRate) / 100000 + amenitiesBonus).toFixed(2));
    
    // Deterministic small precision adjustment based on area and bedrooms (creates a 2k-25k difference)
    let precisionAdjustment = ((area % 23) + (bedrooms * 2)) * 0.001;
    if (precisionAdjustment > 0.25) precisionAdjustment = 0.25;
    if (precisionAdjustment < 0.02) precisionAdjustment = 0.02;

    if (predictionMode === "FREE_VALUATION") {
      totalValueLakhs = Number((baseTotalValueLakhs - precisionAdjustment).toFixed(2));
      const margin = 0.15; // Wider uncertainty for Free
      lowBound = Number((totalValueLakhs * (1 - margin)).toFixed(2));
      highBound = Number((totalValueLakhs * (1 + margin)).toFixed(2));
      localAvgVal = Number((totalValueLakhs * 0.95).toFixed(2));
      localAvgRate = Math.round(calculatedRate * 0.95);
      confidenceLevel = "Basic";
      aiScore = 72;
      
      debugInfo.model = "Basic Valuation Model";
      debugInfo.featuresUsed = 5;
      debugInfo.comparables = 3;
    } else {
      totalValueLakhs = baseTotalValueLakhs;
      const margin = 0.05; // Tight 5% uncertainty band for Premium
      lowBound = Number((totalValueLakhs * (1 - margin)).toFixed(2));
      highBound = Number((totalValueLakhs * (1 + margin)).toFixed(2));
      localAvgVal = pricingMethod === "AI_ESTIMATE" ? Number((totalValueLakhs * 0.96).toFixed(2)) : Number((((area * cityBase) / 100000) * 0.96).toFixed(2));
      localAvgRate = pricingMethod === "AI_ESTIMATE" ? Math.round(calculatedRate * 0.96) : Math.round(cityBase * 0.96);
      confidenceLevel = "High";
      aiScore = 92;

      debugInfo.model = "Advanced Valuation Model";
      debugInfo.featuresUsed = 14;
      debugInfo.comparables = 24;
    }

    const newRecord = {
      id: "prop-" + Date.now(),
      title: `${bedrooms} BHK ${cleanType}`,
      type: cleanType,
      location: cleanLocation,
      locality: cleanLocality,
      area: area,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      floors: floors,
      age: age,
      parking: parking,
      furnishing: cleanFurnishing,
      balcony: Boolean(propertyData.balcony),
      amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : ["Security", "Power Backup", "CCTV"],
      predictedValue: totalValueLakhs,
      priceRange: [lowBound, highBound],
      pricePerSqFt: calculatedRate,
      localAvgPricePerSqFt: localAvgRate,
      localAvgValue: localAvgVal,
      pricingMethod: pricingMethod,
      userPriceSqft: propertyData.userPriceSqft,
      datePredicted: new Date().toISOString().split('T')[0],
      status: "AI Predicted",
      isFavorite: false,
      aiScore: aiScore,
      confidenceLevel: confidenceLevel,
      planUsed: plan,
      predictionMode: predictionMode,
      debugInfo: debugInfo,
      imageUrl: propertyData.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: propertyData.images?.length ? propertyData.images : DEMO_PROPERTIES[0].gallery,
      aiVision: {
        detectedType: `Identified ${propertyData.propertyType || "Residence"}`,
        exteriorCondition: "Inspected: Excellent",
        bedroomsDetected: bedrooms,
        parking: `Detected (${propertyData.parking || 2} Bays)`,
        balcony: propertyData.balcony ? "Detected (Balcony Facade)" : "Not Detected",
        garden: propertyData.amenities?.includes("Garden") ? "Detected (Landscaped)" : "Not Detected",
        pool: propertyData.amenities?.includes("Swimming Pool") ? "Detected (Pool Deck)" : "Not Detected",
        exteriorQuality: "Premium Grade Architectural Spec"
      }
    };

    // Save to history
    const existing = getSavedHistory();
    const updated = [newRecord, ...existing];
    persistHistory(updated);

    return {
      success: true,
      data: newRecord,
      plan: plan,
      features: planFeatures[plan],
      metrics: isFree ? null : MODEL_METRICS,
      featureImportance: isFree ? null : FEATURE_IMPORTANCE
    };
  },

  /**
   * POST /api/upload-images
   * Accepts image files and returns processed web URLs
   */
  uploadImages: async (files) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return files.map((file, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
  },

  /**
   * POST /api/analyze-property
   * Simulates computer vision feature detection
   */
  analyzeVision: async (imageUrl) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      detectedType: "Modern Architecture Residential",
      exteriorCondition: "Good",
      bedroomsDetected: 3,
      parking: "Detected",
      balcony: "Detected",
      garden: "Detected",
      pool: "Not Detected",
      exteriorQuality: "High",
      confidenceScore: 0.94
    };
  },

  /**
   * GET /api/history
   * Retrieves prediction records
   */
  getHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getSavedHistory();
  },

  /**
   * DELETE /api/history/:id
   * Removes a historical prediction
   */
  deleteHistory: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const current = getSavedHistory();
    const filtered = current.filter((item) => item.id !== id);
    persistHistory(filtered);
    return filtered;
  },

  /**
   * GET /api/property/:id
   */
  getPropertyById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const history = getSavedHistory();
    return history.find((p) => p.id === id) || DEMO_PROPERTIES[0];
  },

  /**
   * GET /api/market-insights
   */
  getMarketInsights: async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return MARKET_INSIGHTS;
  },

  /**
   * GET /api/kpi
   */
  getKPIData: async () => {
    return KPI_DATA;
  },

  /**
   * GET /api/properties/:id/price-history
   * Retrieves historical price data for the property's locality.
   */
  getPriceHistory: async (propertyId, userRole = 'premium') => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const isFree = userRole === 'customer_free' || userRole === 'free';
    
    if (isFree) {
      return {
        available: true,
        years_available: 1,
        plan: 'free',
        data: [
          { year: '2025', avgPriceSqFt: 6900 },
          { year: '2026', avgPriceSqFt: 7450 }
        ]
      };
    } else {
      return {
        available: true,
        years_available: 3,
        plan: 'premium',
        data: [
          { year: '2024', avgPriceSqFt: 6400, properties: 145, yoyChange: '+6.5%' },
          { year: '2025', avgPriceSqFt: 6900, properties: 162, yoyChange: '+7.8%' },
          { year: '2026', avgPriceSqFt: 7450, properties: 89, yoyChange: '+8.0%' }
        ]
      };
    }
  },

  /**
   * GET /api/properties/:id/comparables
   */
  getComparables: async (propertyId, userRole = 'premium') => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const isFree = userRole === 'customer_free' || userRole === 'free';
    const plan = isFree ? 'free' : 'premium';
    const limit = planFeatures[plan].maxComparables;
    
    const comparables = [];
    const basePrice = 135;
    for (let i = 1; i <= limit; i++) {
      comparables.push({
        id: `comp-${i}`,
        title: `Comparable Property ${i}`,
        priceLakhs: Number((basePrice + (Math.random() * 20 - 10)).toFixed(2)),
        sqftRate: Math.round(7450 + (Math.random() * 500 - 250)),
        area: 1800 + Math.round(Math.random() * 400 - 200),
        distance: (Math.random() * 3).toFixed(1) + ' km'
      });
    }
    
    return {
      plan,
      limit,
      comparables,
      totalAvailable: 24
    };
  },

  /**
   * POST /api/valuation-report
   * Dynamically generates an AI property valuation report
   */
  generateReport: async (propertyData) => {
    // Simulate API delay for AI generation
    await new Promise((resolve) => setTimeout(resolve, 3500));
    
    if (!propertyData || !propertyData.id) {
      throw new Error("Invalid property data");
    }

    const isFree = propertyData.planUsed === 'free' || propertyData.userRole === 'free' || propertyData.userRole === 'customer_free';
    
    // Simulate a structured JSON response from the AI model
    const report = {
      title: "PropPulse Property Valuation Report",
      propertyOverview: `This is a ${propertyData.bedrooms} BHK ${propertyData.propertyType || 'property'} located in ${propertyData.locality}, ${propertyData.location}. It features a carpet area of ${propertyData.area} sq.ft., situated on floor ${propertyData.floors}, with ${propertyData.bathrooms} bathrooms and ${propertyData.parking} parking spots.`,
      fairValue: `₹${propertyData.predictedValue} Cr`,
      valuationRange: {
        low: `₹${propertyData.priceRange?.[0] || 'N/A'} Cr`,
        high: `₹${propertyData.priceRange?.[1] || 'N/A'} Cr`
      },
      pricePerSqFt: `₹${propertyData.pricePerSqFt?.toLocaleString()}`,
      valuationExplanation: `PropPulse valued this property at ₹${propertyData.predictedValue} Cr primarily due to its favorable location in ${propertyData.locality}, size of ${propertyData.area} sq.ft., and configuration (${propertyData.bedrooms} BHK). The calculated price of ₹${propertyData.pricePerSqFt?.toLocaleString()}/sq.ft. aligns with current market trends in ${propertyData.location}.`,
      comparableAnalysis: isFree ? 
        "Based on a limited sample of 3 comparable properties, this property's valuation is within the expected market range." : 
        "Based on 24 comparable properties sold recently within a 2km radius, this property is positioned slightly above the median, reflecting its premium amenities and configuration.",
      historicalAnalysis: isFree ?
        "Historical data is limited for free users. Upgrade for full 3-year trend analysis." :
        "Available records indicate that the average ₹/sq.ft. increased steadily between 2024 and 2026, demonstrating strong localized appreciation.",
      propertyScoreExplanation: isFree ? null : `The property achieves an AI Score of ${propertyData.aiScore}%, driven largely by strong location and price competitiveness, despite average infrastructure scores.`,
      marketInsight: `The local market in ${propertyData.location} shows robust demand for ${propertyData.bedrooms} BHK properties. Recent sales data indicates steady absorption rates.`,
      strengths: [
        "Favorable location in a high-demand area",
        "Strong configuration for local demographics",
        "Competitive price per sq.ft. relative to comparables"
      ],
      considerations: [
        "Higher asking price than some older comparable properties",
        "Limited supply of similar configurations may drive competition"
      ],
      summary: `In summary, the estimated value of ₹${propertyData.predictedValue} Cr is strongly supported by localized comparable sales and historical appreciation trends. The property benefits from its desirable location and configuration, making it a competitive asset in the current market environment. ${isFree ? 'This is a basic report. Upgrade to Premium for deeper insights.' : ''}`
    };

    return {
      success: true,
      report,
      cached: false,
      timestamp: new Date().toISOString()
    };
  }
};
