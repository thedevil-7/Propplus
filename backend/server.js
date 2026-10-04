import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '../storage/db.json');

app.use(cors());
app.use(express.json());

// Initialize database if it doesn't exist
const initializeDb = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      properties: [],
      history: [],
      kpiData: {
        totalValuations: 14320,
        avgAccuracy: 94.2,
        activeModels: 3,
        systemStatus: 'Optimal'
      },
      marketInsights: {
        trend: [
          { year: '2021', price: 46 },
          { year: '2022', price: 51 },
          { year: '2023', price: 56 },
          { year: '2024', price: 61 },
          { year: '2025', price: 66 },
          { year: '2026 (Now)', price: 71.2 }
        ],
        regionalGrowth: [
          { period: 'Q1 2024', rate: 3100 },
          { period: 'Q2 2024', rate: 3220 },
          { period: 'Q3 2024', rate: 3340 },
          { period: 'Q4 2024', rate: 3410 },
          { period: 'Q1 2025', rate: 3480 },
          { period: 'Q2 2026', rate: 3540 }
        ]
      }
    };
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    } catch (err) {
      console.warn("Deployment Limitation: Cannot initialize DB on Vercel read-only filesystem.", err.message);
    }
  }
};

initializeDb();

// Helper to read DB
const readDb = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Return default empty structure if file is completely missing (e.g., failed to initialize)
      return { properties: [], history: [], kpiData: {}, marketInsights: {} };
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read DB:", err);
    return { properties: [], history: [], kpiData: {}, marketInsights: {} };
  }
};

// Helper to write DB
const writeDb = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("Deployment Limitation: Cannot write to filesystem on Vercel. Need external persistent storage.", err.message);
  }
};

// Endpoints
app.get('/api/kpi', (req, res) => {
  const db = readDb();
  res.json(db.kpiData);
});

app.get('/api/market-insights', (req, res) => {
  const db = readDb();
  res.json(db.marketInsights);
});

app.get('/api/history', (req, res) => {
  const db = readDb();
  res.json(db.history);
});

app.delete('/api/history/:id', (req, res) => {
  const db = readDb();
  db.history = db.history.filter(h => h.id !== req.params.id);
  writeDb(db);
  res.json(db.history);
});

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

app.post('/api/predict', (req, res) => {
  const db = readDb();
  const propertyData = req.body;
  
  // Basic prediction logic for backend
  const area = parseFloat(propertyData.area) || 1800;
  const bedrooms = parseInt(propertyData.bedrooms) || 3;
  const bathrooms = parseInt(propertyData.bathrooms) || 2;
  const cityBase = 3800;
  const amenitiesBonus = (propertyData.amenities?.length || 4) * 0.45;
  
  const isFree = propertyData.userRole === 'customer_free' || propertyData.userRole === 'free';
  const plan = isFree ? 'free' : 'premium';
  const margin = isFree ? 0.12 : 0.06; // Free has A12% range, Premium has A6% range
  const confidenceLevel = isFree ? "Basic" : "High";

  const calculatedRate = Math.round(cityBase + (bedrooms * 35) + (bathrooms * 25));
  const totalValueLakhs = Number(((area * calculatedRate) / 100000 + amenitiesBonus).toFixed(2));
  const lowBound = Number((totalValueLakhs * (1 - margin)).toFixed(2));
  const highBound = Number((totalValueLakhs * (1 + margin)).toFixed(2));
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
    pricingMethod: "AI_ESTIMATE",
    datePredicted: new Date().toISOString().split('T')[0],
    status: "AI Predicted",
    isFavorite: false,
    aiScore: isFree ? Math.floor(60 + Math.random() * 10) : Math.floor(86 + Math.random() * 8),
    confidenceLevel: confidenceLevel,
    planUsed: isFree ? "free" : "premium",
    imageUrl: propertyData.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: propertyData.images?.length ? propertyData.images : [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=800&q=80"
    ]
  };

  db.history.unshift(newRecord);
  writeDb(db);

  res.json({
    success: true,
    data: newRecord,
    plan: plan,
    features: planFeatures[plan]
  });
});

app.get('/api/property/:id', (req, res) => {
  const db = readDb();
  const property = db.history.find(p => p.id === req.params.id) || db.properties.find(p => p.id === req.params.id);
  res.json(property || null);
});

// Mock generating comparables
app.get('/api/properties/:id/comparables', (req, res) => {
  const isFree = req.query.plan === 'free' || req.query.plan === 'customer_free';
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
  
  res.json({
    plan,
    limit,
    comparables,
    totalAvailable: 24
  });
});

app.get('/api/properties/:id/price-history', (req, res) => {
  const isFree = req.query.plan === 'free' || req.query.plan === 'customer_free';
  const plan = isFree ? 'free' : 'premium';
  
  if (plan === 'free') {
    res.json({
      available: true,
      years_available: 1,
      plan: 'free',
      data: [
        { year: '2025', avgPriceSqFt: 6900 },
        { year: '2026', avgPriceSqFt: 7450 }
      ]
    });
  } else {
    res.json({
      available: true,
      years_available: 3,
      plan: 'premium',
      data: [
        { year: '2024', avgPriceSqFt: 6400, properties: 145, yoyChange: '+6.5%' },
        { year: '2025', avgPriceSqFt: 6900, properties: 162, yoyChange: '+7.8%' },
        { year: '2026', avgPriceSqFt: 7450, properties: 89, yoyChange: '+8.0%' }
      ]
    });
  }
});

app.post('/api/valuation-report', (req, res) => {
  const propertyData = req.body;
  const isFree = propertyData.userRole === 'free' || propertyData.userRole === 'customer_free';
  
  // Simulate AI processing delay
  setTimeout(() => {
    const report = {
      title: "PropPulse Property Valuation Report",
      propertyOverview: `This is a ${propertyData.bedrooms} BHK ${propertyData.propertyType || 'property'} located in ${propertyData.locality}, ${propertyData.location}. It has a carpet area of ${propertyData.area} sq.ft., situated on floor ${propertyData.floors}, with ${propertyData.bathrooms} bathrooms and ${propertyData.parking} parking spots.`,
      fairValue: `₹${propertyData.predictedValue} Cr`,
      valuationRange: {
        low: `₹${propertyData.priceRange?.[0] || 'N/A'} Cr`,
        high: `₹${propertyData.priceRange?.[1] || 'N/A'} Cr`
      },
      pricePerSqFt: `₹${propertyData.pricePerSqFt?.toLocaleString()}`,
      valuationExplanation: `PropPulse valued this property at ₹${propertyData.predictedValue} Cr primarily due to its location in ${propertyData.locality}, size of ${propertyData.area} sq.ft., and configuration (${propertyData.bedrooms} BHK). The calculated price of ₹${propertyData.pricePerSqFt?.toLocaleString()}/sq.ft. aligns with current market trends in ${propertyData.location}.`,
      comparableAnalysis: isFree ? 
        "Based on a limited sample of 3 comparable properties, this property's valuation is within the expected market range." : 
        "Based on 24 comparable properties sold recently within a 2km radius, this property is positioned slightly above the median, reflecting its premium amenities and configuration.",
      historicalAnalysis: isFree ?
        "Historical data is limited for free users. Upgrade for full 3-year trend analysis." :
        "Available records indicate that the average ₹/sq.ft. increased steadily between 2024 and 2026, demonstrating strong localized appreciation.",
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

    res.json({
      success: true,
      report,
      cached: false,
      timestamp: new Date().toISOString()
    });
  }, 3500); // 3.5 second delay to simulate AI generation
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
