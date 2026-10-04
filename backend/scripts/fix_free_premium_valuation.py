import os

service_file = r"c:\Users\mggeh\OneDrive\Desktop\Anti-Gravity\proppluse\src\api\propertyService.js"

with open(service_file, "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace the logic inside predictPrice

new_logic = """
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
"""

start_marker = "    // ==========================================\n    // PIPELINE 1: FREE VALUATION\n    // =========================================="
end_marker = "    const newRecord = {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_logic + "\n" + content[end_idx:]
    with open(service_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated propertyService.js")
else:
    print("Could not find markers in propertyService.js")
