// ============================================================================
// PropPulse — Indian Cities API Integration Service
// Integrates: https://indian-cities-api-nocbegfhqg.now.sh/
// With fail-safe fallbacks to official source repository & offline bundle
// ============================================================================

const CACHE_KEY = "proppulse_indian_cities_cache";

// Curated offline fallback covering all major states & key real estate markets
const DEFAULT_FALLBACK_CITIES = [
  // Rajasthan
  { City: "Jaipur", State: "Rajasthan", District: "Jaipur" },
  { City: "Jodhpur", State: "Rajasthan", District: "Jodhpur" },
  { City: "Kota", State: "Rajasthan", District: "Kota" },
  { City: "Udaipur", State: "Rajasthan", District: "Udaipur" },
  { City: "Ajmer", State: "Rajasthan", District: "Ajmer" },
  { City: "Bikaner", State: "Rajasthan", District: "Bikaner" },
  { City: "Alwar", State: "Rajasthan", District: "Alwar" },
  { City: "Bhilwara", State: "Rajasthan", District: "Bhilwara" },
  // Maharashtra
  { City: "Mumbai", State: "Maharashtra", District: "Mumbai City" },
  { City: "Pune", State: "Maharashtra", District: "Pune" },
  { City: "Nagpur", State: "Maharashtra", District: "Nagpur" },
  { City: "Thane", State: "Maharashtra", District: "Thane" },
  { City: "Nashik", State: "Maharashtra", District: "Nashik" },
  { City: "Navi Mumbai", State: "Maharashtra", District: "Thane" },
  { City: "Aurangabad", State: "Maharashtra", District: "Aurangabad" },
  // Karnataka
  { City: "Bengaluru", State: "Karnataka", District: "Bengaluru Urban" },
  { City: "Mysuru", State: "Karnataka", District: "Mysuru" },
  { City: "Mangaluru", State: "Karnataka", District: "Dakshina Kannada" },
  { City: "Hubballi", State: "Karnataka", District: "Dharwad" },
  { City: "Belagavi", State: "Karnataka", District: "Belagavi" },
  // Delhi NCR
  { City: "Delhi", State: "Delhi", District: "New Delhi" },
  { City: "Noida", State: "Uttar Pradesh", District: "Gautam Buddha Nagar" },
  { City: "Gurugram", State: "Haryana", District: "Gurugram" },
  { City: "Faridabad", State: "Haryana", District: "Faridabad" },
  { City: "Ghaziabad", State: "Uttar Pradesh", District: "Ghaziabad" },
  // Telangana & Andhra Pradesh
  { City: "Hyderabad", State: "Telangana", District: "Hyderabad" },
  { City: "Secunderabad", State: "Telangana", District: "Hyderabad" },
  { City: "Warangal", State: "Telangana", District: "Warangal" },
  { City: "Visakhapatnam", State: "Andhra Pradesh", District: "Visakhapatnam" },
  { City: "Vijayawada", State: "Andhra Pradesh", District: "Krishna" },
  // Tamil Nadu
  { City: "Chennai", State: "Tamil Nadu", District: "Chennai" },
  { City: "Coimbatore", State: "Tamil Nadu", District: "Coimbatore" },
  { City: "Madurai", State: "Tamil Nadu", District: "Madurai" },
  { City: "Tiruchirappalli", State: "Tamil Nadu", District: "Tiruchirappalli" },
  { City: "Salem", State: "Tamil Nadu", District: "Salem" },
  // Gujarat
  { City: "Ahmedabad", State: "Gujarat", District: "Ahmedabad" },
  { City: "Surat", State: "Gujarat", District: "Surat" },
  { City: "Vadodara", State: "Gujarat", District: "Vadodara" },
  { City: "Rajkot", State: "Gujarat", District: "Rajkot" },
  { City: "Gandhinagar", State: "Gujarat", District: "Gandhinagar" },
  // West Bengal
  { City: "Kolkata", State: "West Bengal", District: "Kolkata" },
  { City: "Howrah", State: "West Bengal", District: "Howrah" },
  { City: "Durgapur", State: "West Bengal", District: "Paschim Bardhaman" },
  { City: "Siliguri", State: "West Bengal", District: "Darjeeling" },
  // Uttar Pradesh
  { City: "Lucknow", State: "Uttar Pradesh", District: "Lucknow" },
  { City: "Kanpur", State: "Uttar Pradesh", District: "Kanpur Nagar" },
  { City: "Varanasi", State: "Uttar Pradesh", District: "Varanasi" },
  { City: "Agra", State: "Uttar Pradesh", District: "Agra" },
  { City: "Prayagraj", State: "Uttar Pradesh", District: "Prayagraj" },
  // Madhya Pradesh
  { City: "Bhopal", State: "Madhya Pradesh", District: "Bhopal" },
  { City: "Indore", State: "Madhya Pradesh", District: "Indore" },
  { City: "Gwalior", State: "Madhya Pradesh", District: "Gwalior" },
  { City: "Jabalpur", State: "Madhya Pradesh", District: "Jabalpur" },
  // Punjab & Chandigarh
  { City: "Chandigarh", State: "Chandigarh", District: "Chandigarh" },
  { City: "Ludhiana", State: "Punjab", District: "Ludhiana" },
  { City: "Amritsar", State: "Punjab", District: "Amritsar" },
  { City: "Jalandhar", State: "Punjab", District: "Jalandhar" },
  // Kerala
  { City: "Kochi", State: "Kerala", District: "Ernakulam" },
  { City: "Thiruvananthapuram", State: "Kerala", District: "Thiruvananthapuram" },
  { City: "Kozhikode", State: "Kerala", District: "Kozhikode" },
  // Bihar & Jharkhand
  { City: "Patna", State: "Bihar", District: "Patna" },
  { City: "Ranchi", State: "Jharkhand", District: "Ranchi" },
  { City: "Jamshedpur", State: "Jharkhand", District: "East Singhbhum" },
  // Odisha
  { City: "Bhubaneswar", State: "Odisha", District: "Khordha" },
  { City: "Cuttack", State: "Odisha", District: "Cuttack" },
  // Goa
  { City: "Panaji", State: "Goa", District: "North Goa" }
];

let inMemoryCities = null;

function normalizeCityList(rawList) {
  if (!Array.isArray(rawList)) return [];

  const seen = new Set();
  const normalized = [];

  for (const item of rawList) {
    const cityName = (item.City || item.city || "").trim();
    const stateName = (item.State || item.state || "").trim();
    const districtName = (item.District || item.district || "").trim();

    if (!cityName) continue;

    const fullName = stateName ? `${cityName}, ${stateName}` : cityName;
    const key = fullName.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      normalized.push({
        city: cityName,
        state: stateName,
        district: districtName,
        fullName: fullName
      });
    }
  }

  // Sort alphabetically by city name
  return normalized.sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Fetches Indian cities using the requested API endpoint:
 * https://indian-cities-api-nocbegfhqg.now.sh/
 * 
 * Automatically falls back to the official GitHub source repository and offline bundle
 * if network fails, legacy domain is unreachable, or CORS is blocked.
 */
export async function fetchIndianCities() {
  if (inMemoryCities && inMemoryCities.length > 0) {
    return inMemoryCities;
  }

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryCities = parsed;
        return inMemoryCities;
      }
    }
  } catch (e) {
    console.warn("Could not read city cache from localStorage", e);
  }

  // 1. Attempt original API requested by user
  try {
    const response = await fetch("https://indian-cities-api-nocbegfhqg.now.sh/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const text = await response.text();
      // Verify it's valid JSON rather than redirect HTML
      if (text.startsWith("{") || text.startsWith("[")) {
        const data = JSON.parse(text);
        console.log("Indian Cities API response:", data);
        const list = Array.isArray(data) ? data : (data.cities || []);
        if (list.length > 0) {
          inMemoryCities = normalizeCityList(list);
          saveCache(inMemoryCities);
          return inMemoryCities;
        }
      }
    }
  } catch (err) {
    console.info("Indian Cities API (now.sh) unavailable, querying primary dataset source...", err.message);
  }

  // 2. Attempt with /cities endpoint
  try {
    const response = await fetch("https://indian-cities-api-nocbegfhqg.now.sh/cities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const text = await response.text();
      if (text.startsWith("{") || text.startsWith("[")) {
        const data = JSON.parse(text);
        console.log("Indian Cities API (/cities) response:", data);
        const list = Array.isArray(data) ? data : (data.cities || []);
        if (list.length > 0) {
          inMemoryCities = normalizeCityList(list);
          saveCache(inMemoryCities);
          return inMemoryCities;
        }
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  // 3. Query official GitHub raw dataset for fayazara/Indian-Cities-API (db.json)
  try {
    const response = await fetch("https://raw.githubusercontent.com/fayazara/Indian-Cities-API/master/db.json");
    if (response.ok) {
      const data = await response.json();
      console.log("Loaded Indian Cities from GitHub raw source dataset:", data?.cities?.length, "cities");
      const list = data.cities || (Array.isArray(data) ? data : []);
      if (list.length > 0) {
        inMemoryCities = normalizeCityList(list);
        saveCache(inMemoryCities);
        return inMemoryCities;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch raw db.json, applying built-in offline dataset", err);
  }

  // 4. Guaranteed offline fallback dataset
  inMemoryCities = normalizeCityList(DEFAULT_FALLBACK_CITIES);
  saveCache(inMemoryCities);
  return inMemoryCities;
}

function saveCache(cities) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cities));
  } catch (e) {
    // ignore quota error
  }
}

/**
 * Returns immediate synchronous list (from cache or defaults)
 */
export function getIndianCitiesSync() {
  if (inMemoryCities && inMemoryCities.length > 0) {
    return inMemoryCities;
  }
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryCities = parsed;
        return inMemoryCities;
      }
    }
  } catch (e) {}

  return normalizeCityList(DEFAULT_FALLBACK_CITIES);
}
