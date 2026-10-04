export const formatPropertyValue = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  let num = parseFloat(value);
  
  // Convert legacy/current Lakhs format (e.g., 72.50) into raw rupees.
  // Because property values in India are generally > ₹100,000, 
  // any `value` less than 100,000 is definitely in Lakhs (or Crores, but currently it's Lakhs).
  if (num > 0 && num < 100000) {
    num = num * 100000;
  }
  
  if (num < 10000000) {
    // Below ₹100 Lakhs (1 Crore) -> Display in Lakhs
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  } else {
    // ₹100 Lakhs or above -> Convert to Crores
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
};
