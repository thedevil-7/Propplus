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

    // Strict input sanitization and boundary clamping
    const parsedArea = parseFloat(propertyData.area);
    const area = (!isNaN(parsedArea) && parsedArea > 0) ? Math.min(100000, parsedArea) : 1800;
    const cleanLocation = String(propertyData.location || "Jaipur, Rajasthan").trim().slice(0, 120);
    const cleanLocality = String(propertyData.locality || "C-Scheme").trim().slice(0, 120);
    const cleanType = String(propertyData.propertyType || "Villa").trim().slice(0, 60);
    const cleanFurnishing = ["Furnished", "Semi-Furnished", "Unfurnished"].includes(propertyData.furnishing)
      ? propertyData.furnishing
      : "Furnished";

    const locLower = cleanLocation.toLowerCase();
    const localityLower = cleanLocality.toLowerCase();

    let cityBase = 3800; // Default Tier-2 / Tier-3 benchmark
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
    } else if (locLower.includes("chandigarh")) {
      cityBase = 8200;
    } else if (locLower.includes("kochi") || locLower.includes("thiruvananthapuram")) {
      cityBase = 5400;
    } else if (locLower.includes("lucknow") || locLower.includes("kanpur") || locLower.includes("varanasi")) {
      cityBase = 4600;
    } else if (locLower.includes("indore") || locLower.includes("bhopal")) {
      cityBase = 4800;
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
    } else if (locLower.includes("udaipur")) {
      cityBase = 3550;
      if (localityLower.includes("fateh")) cityBase += 280;
      else if (localityLower.includes("panchwati")) cityBase += 180;
    } else if (locLower.includes("jaipur")) {
      cityBase = 3900;
      if (localityLower.includes("c-scheme") || localityLower.includes("c scheme")) cityBase += 250;
      else if (localityLower.includes("malviya")) cityBase += 100;
      else if (localityLower.includes("vaishali")) cityBase += 100;
      else if (localityLower.includes("mansarovar")) cityBase -= 150;
    }

    const bedrooms = Math.max(0, Math.min(25, parseInt(propertyData.bedrooms, 10) || 3));
    const bathrooms = Math.max(0, Math.min(25, parseInt(propertyData.bathrooms, 10) || 2));
    const floors = Math.max(1, Math.min(50, parseInt(propertyData.floors, 10) || 2));
    const age = Math.max(0, Math.min(100, parseInt(propertyData.age, 10) || 1));
    const parking = Math.max(0, Math.min(50, parseInt(propertyData.parking, 10) || 2));
    const amenitiesBonus = (propertyData.amenities?.length || 4) * 0.45;
    
    // Dynamic calculation simulating ML regression
    const calculatedRate = Math.round(cityBase + (bedrooms * 35) + (bathrooms * 25));
    const totalValueLakhs = Number(((area * calculatedRate) / 100000 + amenitiesBonus).toFixed(2));
    const lowBound = Number((totalValueLakhs * 0.94).toFixed(2));
    const highBound = Number((totalValueLakhs * 1.06).toFixed(2));
    const localAvgVal = Number((totalValueLakhs * 0.96).toFixed(2));
    const localAvgRate = Math.round(calculatedRate * 0.96);

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
      datePredicted: new Date().toISOString().split('T')[0],
      status: "AI Predicted",
      isFavorite: false,
      aiScore: Math.floor(86 + Math.random() * 8),
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
      metrics: MODEL_METRICS,
      featureImportance: FEATURE_IMPORTANCE
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
  }
};
