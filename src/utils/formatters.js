export const formatPropertyValue = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  let num = parseFloat(value);
  
  // If the value is extremely large, it's likely raw rupees, convert to Lakhs
  if (num >= 100000) {
    num = num / 100000;
  }
  
  // Return consistently formatted value in Lakhs
  return `₹${num.toFixed(2)} Lakhs`;
};
