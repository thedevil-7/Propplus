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
    console.warn("Storage write error", e);
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

    const area = parseFloat(propertyData.area) || 1800;
    const locLower = (propertyData.location || "").toLowerCase();
    const localityLower = (propertyData.locality || "").toLowerCase();

    let cityBase = 3500;
    if (locLower.includes("jodhpur")) {
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

    const bedrooms = parseInt(propertyData.bedrooms) || 3;
    const bathrooms = parseInt(propertyData.bathrooms) || 2;
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
      title: `${bedrooms} BHK ${propertyData.propertyType || "Villa"}`,
      type: propertyData.propertyType || "Villa",
      location: propertyData.location || "Jaipur, Rajasthan",
      locality: propertyData.locality || "C-Scheme",
      area: area,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      floors: parseInt(propertyData.floors) || 2,
      age: parseInt(propertyData.age) || 1,
      parking: parseInt(propertyData.parking) || 2,
      furnishing: propertyData.furnishing || "Furnished",
      balcony: Boolean(propertyData.balcony),
      amenities: propertyData.amenities || ["Security", "Power Backup", "CCTV"],
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
