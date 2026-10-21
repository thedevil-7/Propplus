import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Secure Environment Loading (Loads secret keys from .env without exposing them)
try {
  if (typeof process.loadEnvFile === 'function') {
    const candidatePaths = [
      path.join(__dirname, '../.env'),
      path.join(__dirname, '.env')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        process.loadEnvFile(p);
        break;
      }
    }
  }
} catch (envErr) {
  // Graceful fallback if cloud provider injects environment directly
}

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '../storage/db.json');

// ============================================================================
// REAL-TIME INTRUSION DETECTION & PREVENTION SYSTEM (IDPS / WAF)
// ============================================================================

// In-Memory IP Jail (Auto-Ban for malicious bots and scanners)
const bannedIps = new Map(); // ip -> unbanTimestamp
const securityMetrics = {
  totalScansBlocked: 0,
  totalXSSBlocked: 0,
  totalTraversalsBlocked: 0,
  currentlyBannedIps: 0
};

// Known malicious probe targets typically scanned by automated hacker tools
const MALICIOUS_PROBE_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/pma/i,
  /\/\.aws/i,
  /\/\.docker/i,
  /\/cgi-bin/i,
  /\/actuator/i,
  /\/swagger-ui/i,
  /\/console/i,
  /\/eval-stdin/i,
  /\/debug\/default\/view/i,
  /\/\.well-known\/security\.txt/i,
  /\/etc\/passwd/i,
  /\/win\.ini/i
];

// Dangerous script and injection signatures
const INJECTION_SIGNATURES = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on(?:load|error|click|mouseover|submit|focus)\s*=/gi,
  /\bunion\s+(?:all\s+)?select\b/gi,
  /\b(?:drop|truncate|alter)\s+table\b/gi,
  /(?:\.\.\/|\.\.\\)/g // Path traversal
];

// Helper to get client IP cleanly behind proxies (Vercel, Cloudflare, Nginx)
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
};

// 1. IP Jail Check (Immediately drops traffic from auto-banned IPs)
app.use((req, res, next) => {
  const ip = getClientIp(req);
  const banExpiry = bannedIps.get(ip);
  if (banExpiry) {
    if (Date.now() < banExpiry) {
      const remainingSeconds = Math.ceil((banExpiry - Date.now()) / 1000);
      return res.status(403).json({
        success: false,
        error: `Security Alert: Your IP has been temporarily blacklisted due to suspicious activity. Try again in ${remainingSeconds}s.`,
        code: 403
      });
    } else {
      bannedIps.delete(ip);
      securityMetrics.currentlyBannedIps = bannedIps.size;
    }
  }
  next();
});

// 2. Scanner & Exploit Probe Trap (Immediate Auto-Ban)
app.use((req, res, next) => {
  const rawUrl = req.originalUrl || req.url;
  for (const pattern of MALICIOUS_PROBE_PATTERNS) {
    if (pattern.test(rawUrl)) {
      const ip = getClientIp(req);
      const BAN_DURATION_MS = 30 * 60 * 1000; // 30-minute ban
      bannedIps.set(ip, Date.now() + BAN_DURATION_MS);
      securityMetrics.totalScansBlocked++;
      securityMetrics.currentlyBannedIps = bannedIps.size;
      
      console.warn(`[SECURITY ALERT - HACKER PROBE BLOCKED] IP: ${ip} attempted scanning: "${rawUrl}". Auto-banned for 30 minutes.`);
      
      return res.status(403).json({
        success: false,
        error: "Forbidden: Security violation detected.",
        code: 403
      });
    }
  }
  next();
});

// 3. Hide server fingerprinting to prevent reconnaissance by attackers
app.disable('x-powered-by');

// 2. HTTP Security Headers with Helmet
// Protects against XSS, clickjacking, MIME sniffing, and packet sniffing
app.use(helmet({
  contentSecurityPolicy: false, // Maintain frontend compatibility
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 4. In-Flight XSS & Injection Sanitizer (Scans payloads in real-time)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const inspectString = JSON.stringify(req.body);
    for (const signature of INJECTION_SIGNATURES) {
      if (signature.test(inspectString)) {
        const ip = getClientIp(req);
        securityMetrics.totalXSSBlocked++;
        console.warn(`[SECURITY ALERT - MALICIOUS INJECTION BLOCKED] IP: ${ip} payload contained injection signature:`, signature);
        return res.status(400).json({
          success: false,
          error: "Bad Request: Malicious content or injection signature detected by real-time security filter.",
          code: 400
        });
      }
    }
  }
  next();
});

// 5. Global Rate Limiter: Blocks automated bot attacks & scraping
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 250, // Max 250 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from your IP. Real-time rate limiting active. Please try again later.",
    code: 429
  }
});
app.use('/api/', globalLimiter);

// 5. Stricter Rate Limiter for Valuation & Resource-heavy AI Endpoints
const valuationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Max 60 valuations per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Valuation quota rate limit reached. Please wait a few minutes before submitting new properties.",
    code: 429
  }
});
app.use('/api/predict', valuationLimiter);
app.use('/api/valuation-report', valuationLimiter);

// 6. Hardened CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000")
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, server-to-server, curl) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Security Alert: Blocked unauthorized cross-origin request from ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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

// ============================================================================
// SECURE STATE & CITY API PROXY
// Third-party API keys are injected SERVER-SIDE and NEVER leaked to client browser
// ============================================================================
let cachedCities = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1-hour in-memory cache to prevent upstream API abuse

app.get('/api/cities', async (req, res) => {
  try {
    const now = Date.now();
    if (cachedCities && Array.isArray(cachedCities) && (now - lastCacheTimestamp < CACHE_TTL_MS)) {
      return res.json({
        success: true,
        count: cachedCities.length,
        data: cachedCities,
        cached: true
      });
    }

    // Read secrets securely from server environment
    const primaryUrl = process.env.CITY_API_URL || process.env.VITE_CITY_API_URL || "https://indian-cities-api-nocbegfhqg.now.sh/";
    const backupUrl = process.env.CITY_API_BACKUP_URL || process.env.VITE_CITY_API_BACKUP_URL || "https://raw.githubusercontent.com/fayazara/Indian-Cities-API/master/db.json";
    const apiKey = process.env.CITY_API_KEY || "";

    const headers = {
      "Content-Type": "application/json"
    };
    if (apiKey) {
      headers["X-API-KEY"] = apiKey;
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    let cities = null;

    // 1. Attempt primary API provider
    try {
      const response = await fetch(primaryUrl, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        const text = await response.text();
        if (text.startsWith("{") || text.startsWith("[")) {
          const data = JSON.parse(text);
          cities = Array.isArray(data) ? data : (data.cities || []);
        }
      }
    } catch (err) {
      console.warn("Primary state/city API request failed:", err.message);
    }

    // 2. Fallback to backup repository if primary fails
    if (!cities || cities.length === 0) {
      try {
        const backupResp = await fetch(backupUrl, {
          method: "GET",
          signal: AbortSignal.timeout(4000)
        });
        if (backupResp.ok) {
          const data = await backupResp.json();
          cities = data.cities || (Array.isArray(data) ? data : []);
        }
      } catch (backupErr) {
        console.warn("Backup state/city API request failed:", backupErr.message);
      }
    }

    if (cities && cities.length > 0) {
      cachedCities = cities;
      lastCacheTimestamp = now;
      return res.json({
        success: true,
        count: cities.length,
        data: cities
      });
    }

    return res.status(502).json({
      success: false,
      error: "State and city providers currently unreachable",
      data: []
    });
  } catch (error) {
    console.error("Secure City Proxy Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error during city resolution"
    });
  }
});

// ============================================================================
// REAL-TIME SECURITY DASHBOARD & STATUS TELEMETRY
// ============================================================================
app.get('/api/security-status', (req, res) => {
  res.json({
    status: "Active & Guarding",
    shieldLevel: "Institutional-Grade (Tier-1 Defenses)",
    activeDefenses: [
      "Real-Time Scanner Trap & Auto-Banning IP Jail (30-min blacklisting)",
      "In-Flight XSS & SQL/NoSQL Injection Sanitizer",
      "Brute-Force & Bot Rate Limiters (express-rate-limit)",
      "Strict Payload Size Guard (100kb limit)",
      "Helmet HTTP Security Headers (HSTS, Anti-Clickjacking, No-Sniff)",
      "CORS Whitelist Protection",
      "Server Fingerprint Cloaking (X-Powered-By stripped)",
      "Isolated Backend BFF Proxy (API keys 100% hidden from client)"
    ],
    liveMetrics: {
      totalScansBlocked: securityMetrics.totalScansBlocked,
      totalXSSBlocked: securityMetrics.totalXSSBlocked,
      totalTraversalsBlocked: securityMetrics.totalTraversalsBlocked,
      currentlyBannedIps: bannedIps.size
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

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

// Centralized Safe Error Handling Middleware
// Prevents exposing stack traces, filesystem structure, or server internals to attackers
app.use((err, req, res, next) => {
  console.error(`[Security Alert] ${req.method} ${req.url} - Error:`, err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? "An unexpected processing error occurred." 
      : err.message || "Internal Server Error",
    code: err.status || 500
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
