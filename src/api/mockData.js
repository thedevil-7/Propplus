// ============================================================================
// PropPulse — Realistic Demo Dataset & Constants
// ============================================================================

export const REGIONAL_LOCALITIES = {
  "Jaipur, Rajasthan": [
    "C-Scheme",
    "Malviya Nagar",
    "Vaishali Nagar",
    "Mansarovar",
    "Civil Lines",
    "Jagatpura",
    "Raja Park",
    "Tonk Road"
  ],
  "Jodhpur, Rajasthan": [
    "Shastri Nagar",
    "Ratanada",
    "Sardarpura",
    "Paota",
    "Chopasni Housing Board",
    "Pal Road",
    "Circuit House Road"
  ],
  "Kota, Rajasthan": [
    "Talwandi",
    "Vigyan Nagar",
    "Kunhari",
    "Rajiv Gandhi Nagar",
    "Dadabari",
    "Mahaveer Nagar",
    "Gumanpura"
  ],
  "Udaipur, Rajasthan": [
    "Panchwati",
    "Fatehsagar Road",
    "Sukher",
    "Hiran Magri",
    "Shobhagpura"
  ]
};

export const DEMO_PROPERTIES = [
  // --- JAIPUR PROPERTIES ---
  {
    id: "prop-101",
    title: "The Glass Pavilion Villa",
    type: "Villa",
    location: "Jaipur, Rajasthan",
    locality: "C-Scheme",
    area: 1800,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    age: 2,
    parking: 2,
    furnishing: "Furnished",
    balcony: true,
    amenities: ["Swimming Pool", "Garden", "Security", "Smart Home", "CCTV", "Power Backup"],
    predictedValue: 72.50, // in Lakhs
    priceRange: [68.00, 77.00],
    pricePerSqFt: 4028,
    localAvgPricePerSqFt: 3880,
    localAvgValue: 69.80,
    datePredicted: "2026-09-10",
    status: "Verified",
    isFavorite: true,
    aiScore: 89,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Modern Architecture Villa",
      exteriorCondition: "Pristine / Good",
      bedroomsDetected: 3,
      parking: "Detected (2 Car Bay)",
      balcony: "Detected (Cantilevered Glass)",
      garden: "Detected (Front Landscaped)",
      pool: "Detected (Rear Lap Pool)",
      exteriorQuality: "High Grade Composite"
    }
  },
  {
    id: "prop-102",
    title: "Azure Sky Heights",
    type: "Apartment",
    location: "Jaipur, Rajasthan",
    locality: "Malviya Nagar",
    area: 1850,
    bedrooms: 3,
    bathrooms: 3,
    floors: 14,
    age: 1,
    parking: 2,
    furnishing: "Semi-Furnished",
    balcony: true,
    amenities: ["Gym", "Lift", "Club House", "Security", "Solar"],
    predictedValue: 74.00,
    priceRange: [71.00, 78.50],
    pricePerSqFt: 4000,
    localAvgPricePerSqFt: 3910,
    localAvgValue: 71.50,
    datePredicted: "2026-09-08",
    status: "Verified",
    isFavorite: false,
    aiScore: 91,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "High-Rise Urban Apartment",
      exteriorCondition: "Brand New / Premium",
      bedroomsDetected: 3,
      parking: "Detected (Covered Basement)",
      balcony: "Detected (Double Balcony)",
      garden: "Detected (Community Pod)",
      pool: "Detected (Rooftop Infinity)",
      exteriorQuality: "Curtain Wall Glass"
    }
  },

  // --- JODHPUR PROPERTIES ---
  {
    id: "prop-201",
    title: "Sun City Imperial Villa",
    type: "Villa",
    location: "Jodhpur, Rajasthan",
    locality: "Shastri Nagar",
    area: 2100,
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    age: 2,
    parking: 2,
    furnishing: "Furnished",
    balcony: true,
    amenities: ["Garden", "Security", "Power Backup", "CCTV", "Smart Home", "Solar"],
    predictedValue: 68.50,
    priceRange: [65.00, 72.00],
    pricePerSqFt: 3262,
    localAvgPricePerSqFt: 3180,
    localAvgValue: 66.80,
    datePredicted: "2026-09-11",
    status: "Verified",
    isFavorite: true,
    aiScore: 92,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Jodhpur Sandstone Contemporary Villa",
      exteriorCondition: "Excellent",
      bedroomsDetected: 4,
      parking: "Detected (Wide Portico)",
      balcony: "Detected (Jharokha Style)",
      garden: "Detected (Lush Front Lawn)",
      pool: "Not Detected",
      exteriorQuality: "Carved Natural Sandstone"
    }
  },
  {
    id: "prop-202",
    title: "Marwar Heights Residence",
    type: "Apartment",
    location: "Jodhpur, Rajasthan",
    locality: "Ratanada",
    area: 1600,
    bedrooms: 3,
    bathrooms: 2,
    floors: 8,
    age: 3,
    parking: 1,
    furnishing: "Semi-Furnished",
    balcony: true,
    amenities: ["Lift", "Security", "Power Backup", "CCTV"],
    predictedValue: 54.00,
    priceRange: [51.50, 57.00],
    pricePerSqFt: 3375,
    localAvgPricePerSqFt: 3290,
    localAvgValue: 52.60,
    datePredicted: "2026-09-09",
    status: "Verified",
    isFavorite: false,
    aiScore: 88,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Mid-Rise Residential Complex",
      exteriorCondition: "Well Maintained",
      bedroomsDetected: 3,
      parking: "Detected (Stilt Parking)",
      balcony: "Detected",
      garden: "Detected (Podium)",
      pool: "Not Detected",
      exteriorQuality: "Stucco & Stone Clad"
    }
  },

  // --- KOTA PROPERTIES ---
  {
    id: "prop-301",
    title: "Chambal Vista Executive Home",
    type: "Independent House",
    location: "Kota, Rajasthan",
    locality: "Talwandi",
    area: 1900,
    bedrooms: 3,
    bathrooms: 3,
    floors: 2,
    age: 3,
    parking: 2,
    furnishing: "Furnished",
    balcony: true,
    amenities: ["Security", "Power Backup", "Garden", "CCTV", "Parking"],
    predictedValue: 52.50,
    priceRange: [49.50, 55.80],
    pricePerSqFt: 2763,
    localAvgPricePerSqFt: 2680,
    localAvgValue: 50.90,
    datePredicted: "2026-09-10",
    status: "Verified",
    isFavorite: true,
    aiScore: 90,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Modern Independent Duplex",
      exteriorCondition: "Good Condition",
      bedroomsDetected: 3,
      parking: "Detected (Driveway)",
      balcony: "Detected (Upper Terrace)",
      garden: "Detected (Courtyard)",
      pool: "Not Detected",
      exteriorQuality: "Textured Weatherproof Paint"
    }
  },
  {
    id: "prop-302",
    title: "Riverfront Green Residency",
    type: "Apartment",
    location: "Kota, Rajasthan",
    locality: "Kunhari",
    area: 1350,
    bedrooms: 2,
    bathrooms: 2,
    floors: 10,
    age: 1,
    parking: 1,
    furnishing: "Semi-Furnished",
    balcony: true,
    amenities: ["Gym", "Lift", "Security", "CCTV", "Club House"],
    predictedValue: 36.80,
    priceRange: [34.50, 39.00],
    pricePerSqFt: 2725,
    localAvgPricePerSqFt: 2640,
    localAvgValue: 35.60,
    datePredicted: "2026-09-06",
    status: "Verified",
    isFavorite: false,
    aiScore: 87,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Contemporary High-Rise Tower",
      exteriorCondition: "New Construction",
      bedroomsDetected: 2,
      parking: "Detected (Basement)",
      balcony: "Detected",
      garden: "Detected",
      pool: "Detected",
      exteriorQuality: "High Grade Exterior Finish"
    }
  },

  // --- ADDITIONAL JAIPUR COMP ---
  {
    id: "prop-103",
    title: "Heritage Courtyard Enclave",
    type: "Independent House",
    location: "Jaipur, Rajasthan",
    locality: "Vaishali Nagar",
    area: 1700,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    age: 4,
    parking: 1,
    furnishing: "Unfurnished",
    balcony: true,
    amenities: ["Security", "Power Backup", "Garden", "CCTV"],
    predictedValue: 68.00,
    priceRange: [64.50, 72.00],
    pricePerSqFt: 4000,
    localAvgPricePerSqFt: 3820,
    localAvgValue: 66.20,
    datePredicted: "2026-09-04",
    status: "Verified",
    isFavorite: false,
    aiScore: 86,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    aiVision: {
      detectedType: "Heritage Contemporary Synthesis",
      exteriorCondition: "Good",
      bedroomsDetected: 3,
      parking: "Detected",
      balcony: "Detected",
      garden: "Detected",
      pool: "Not Detected",
      exteriorQuality: "Standard Brick & Lime Finish"
    }
  }
];

export const KPI_DATA = {
  propertiesAnalyzed: 1482,
  averageEstimatedValue: "₹65.8L",
  averagePricePerSqFt: "₹3,540",
  modelPerformanceR2: "89%",
  trends: {
    analyzedChange: "+18.5% this month",
    valueChange: "+4.2% across Rajasthan hubs",
    sqftChange: "+6.3% YoY average",
    r2ScoreStatus: "High confidence baseline"
  }
};

export const FEATURE_IMPORTANCE = [
  {
    feature: "Area (Square Feet)",
    importance: 40,
    explanation: "Larger properties in this micro-market historically correlate with higher overall valuation due to space scarcity."
  },
  {
    feature: "Location & Locality",
    importance: 30,
    explanation: "Locality tier (e.g. C-Scheme in Jaipur, Shastri Nagar in Jodhpur, or Talwandi in Kota) dictates the baseline square-foot rate."
  },
  {
    feature: "Bedrooms (BHK)",
    importance: 15,
    explanation: "3 and 4 BHK configurations match the primary buyer demographic demand curve across major urban centres."
  },
  {
    feature: "Bathrooms",
    importance: 8,
    explanation: "Ensuite and modern sanitary layouts provide an elevated liquidity premium."
  },
  {
    feature: "Property Age",
    importance: 5,
    explanation: "Properties under 5 years old experience negligible structural depreciation impact."
  },
  {
    feature: "Dedicated Parking",
    importance: 2,
    explanation: "Covered dedicated 2-car slots ensure steady tenant retention and resale appeal."
  }
];

export const MODEL_METRICS = {
  r2Score: "89%",
  r2Tooltip: "Coefficient of determination (R²): Measures how well unseen property pricing variations are explained by the trained model (89% explanatory power across regional comps).",
  mae: "₹3.2L",
  maeTooltip: "Mean Absolute Error: The average absolute price deviation between predicted valuation and verified closing sales is ₹3.2 Lakhs.",
  rmse: "₹4.7L",
  rmseTooltip: "Root Mean Squared Error: Penalizes larger valuation discrepancies, standing at ₹4.7 Lakhs across historical cross-validation sets."
};

export const MARKET_INSIGHTS = {
  cards: {
    bestValueArea: "Kota (Talwandi & Kunhari)",
    highestAveragePrice: "Jaipur (C-Scheme & Civil Lines)",
    fastestGrowingArea: "Jodhpur (Shastri Nagar Ext)",
    mostPopularType: "3 BHK Luxury Villa / Apartment"
  },
  priceByLocation: [
    { location: "Jaipur C-Scheme", price: 74.2 },
    { location: "Jaipur Malviya", price: 71.5 },
    { location: "Jodhpur Shastri", price: 68.5 },
    { location: "Jodhpur Ratanada", price: 54.0 },
    { location: "Kota Talwandi", price: 52.5 },
    { location: "Kota Kunhari", price: 36.8 },
    { location: "Udaipur Fatehsagar", price: 82.0 },
    { location: "Delhi South", price: 185.0 }
  ],
  priceTrend: [
    { year: "2021", price: 46 },
    { year: "2022", price: 51 },
    { year: "2023", price: 56 },
    { year: "2024", price: 61 },
    { year: "2025", price: 66 },
    { year: "2026 (Now)", price: 71.2 }
  ],
  pricePerSqFtArea: [
    { period: "Q1 2024", rate: 3100 },
    { period: "Q2 2024", rate: 3220 },
    { period: "Q3 2024", rate: 3340 },
    { period: "Q4 2024", rate: 3410 },
    { period: "Q1 2025", rate: 3480 },
    { period: "Q2 2026", rate: 3540 }
  ],
  propertyTypeDistribution: [
    { type: "Apartment", percentage: 48, color: "#6366F1" },
    { type: "Villa", percentage: 28, color: "#38BDF8" },
    { type: "Independent House", percentage: 18, color: "#10B981" },
    { type: "Plot", percentage: 6, color: "#F59E0B" }
  ]
};

export const FLOOR_PLAN_ROOMS = [
  { id: "living", name: "Living Room", area: 320, floor: "Ground Floor", dimensions: "16' x 20'", description: "Expansive double-height entertainment area with panoramic glass fenestration." },
  { id: "kitchen", name: "Modern Kitchen", area: 160, floor: "Ground Floor", dimensions: "10' x 16'", description: "Modular European style kitchen with island counter and chimney exhaust." },
  { id: "master_bed", name: "Master Bedroom", area: 240, floor: "First Floor", dimensions: "15' x 16'", description: "Spacious master suite featuring private walk-in closet and balcony terrace." },
  { id: "bed_2", name: "Bedroom 2", area: 180, floor: "First Floor", dimensions: "12' x 15'", description: "Well-ventilated guest bedroom with fitted wardrobes." },
  { id: "bed_3", name: "Bedroom 3", area: 150, floor: "First Floor", dimensions: "10' x 15'", description: "Flexible room suitable for a children's bedroom or executive home office." },
  { id: "bathroom", name: "Primary Bath & Spa", area: 90, floor: "Ground Floor", dimensions: "9' x 10'", description: "Modern bath with walk-in shower enclosure and designer vanity." },
  { id: "balcony", name: "Sky Balcony", area: 120, floor: "First Floor", dimensions: "8' x 15'", description: "Open-air cantilevered terrace overlooking front garden landscape." },
  { id: "garage", name: "Covered Garage", area: 280, floor: "Ground Floor", dimensions: "14' x 20'", description: "Secure dual-vehicle parking bay with EV charging dock." }
];
