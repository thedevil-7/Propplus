/**
 * PropPulse - Reusable Indian Currency Formatting Utility
 * Adheres strictly to Indian Numbering System (Lakh & Crore)
 *
 * Examples:
 *  - ₹80,19,000  = ₹80.19 Lakh
 *  - ₹1,00,00,000 = ₹1 Crore
 *  - ₹1,25,00,000 = ₹1.25 Crore
 *  - ₹1,13,48,000 = ₹1.13 Crore approximately
 *  - ₹45,000     = ₹45,000
 */

/**
 * Normalizes any property price input into a clean numeric INR value.
 * Handles legacy Lakh representations (values < 500 are assumed to be in Lakhs).
 *
 * @param {number|string} val
 * @returns {number} Numeric INR value
 */
export const toNumericInr = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') {
    if (isNaN(val)) return 0;
    // Legacy support: if value is between 0 and 500 (e.g. 72.5), it was stored as Lakhs
    if (val > 0 && val < 500) {
      return Math.round(val * 100000);
    }
    return Math.round(val);
  }

  const str = String(val).trim();
  // Strip currency symbols and commas
  const cleaned = str.replace(/[₹,\s]/g, '');

  // Check for 'Cr' or 'Crore' in string
  if (/cr(ore)?/i.test(cleaned)) {
    const num = parseFloat(cleaned.replace(/cr(ore)?/i, ''));
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }

  // Check for 'L' or 'Lakh' in string
  if (/l(akh)?s?/i.test(cleaned)) {
    const num = parseFloat(cleaned.replace(/l(akh)?s?/i, ''));
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  if (parsed > 0 && parsed < 500) {
    return Math.round(parsed * 100000);
  }
  return Math.round(parsed);
};

/**
 * Formats a number using Indian comma grouping (e.g. 80,19,000).
 *
 * @param {number|string} val
 * @returns {string} Formatted INR with commas (e.g. "80,19,000")
 */
export const formatIndianCommas = (val) => {
  const num = toNumericInr(val);
  if (num === 0) return '0';
  return num.toLocaleString('en-IN');
};

/**
 * Primary Reusable Indian Currency Formatter.
 * Formats numeric INR values into ₹ Lakh or ₹ Crore notation.
 *
 * @param {number|string} value - Raw price in INR (e.g. 8019000, 12500000)
 * @param {Object} [options]
 * @param {boolean} [options.showSymbol=true] - Prefix with ₹
 * @param {boolean} [options.approx=false] - Append "approximately"
 * @param {boolean} [options.full=false] - Show full commas format alongside (e.g. "₹1.25 Crore (₹1,25,00,000)")
 * @returns {string}
 */
export const formatIndianCurrency = (value, options = {}) => {
  if (value === null || value === undefined || value === '') return 'N/A';

  const num = toNumericInr(value);
  if (isNaN(num) || num <= 0) return '₹0';

  const prefix = options.showSymbol !== false ? '₹' : '';
  const approxText = options.approx ? ' approximately' : '';

  // 1 Crore = 1,00,00,000 (10 Million)
  if (num >= 10000000) {
    const inCr = num / 10000000;
    // Format to up to 2 decimal places, removing redundant trailing zeroes (e.g. 1.00 -> 1, 1.25 -> 1.25)
    let formattedCr = inCr.toFixed(2);
    if (formattedCr.endsWith('.00')) {
      formattedCr = formattedCr.slice(0, -3);
    } else if (formattedCr.endsWith('0')) {
      formattedCr = formattedCr.slice(0, -1);
    }
    const result = `${prefix}${formattedCr} Crore${approxText}`;
    if (options.full) {
      return `${result} (${prefix}${formatIndianCommas(num)})`;
    }
    return result;
  }

  // 1 Lakh = 1,00,000 (100 Thousand)
  if (num >= 100000) {
    const inLakh = num / 100000;
    let formattedLakh = inLakh.toFixed(2);
    if (formattedLakh.endsWith('.00')) {
      formattedLakh = formattedLakh.slice(0, -3);
    } else if (formattedLakh.endsWith('0')) {
      formattedLakh = formattedLakh.slice(0, -1);
    }
    const result = `${prefix}${formattedLakh} Lakh${approxText}`;
    if (options.full) {
      return `${result} (${prefix}${formatIndianCommas(num)})`;
    }
    return result;
  }

  // Below 1 Lakh (e.g. monthly EMI, fees, token deposits)
  return `${prefix}${formatIndianCommas(num)}`;
};

/**
 * Drop-in replacement alias for existing codebase usages.
 */
export const formatPropertyValue = (value, options = {}) => {
  return formatIndianCurrency(value, options);
};

/**
 * Formats price per sq.ft consistently.
 *
 * @param {number|string} rate
 * @returns {string} e.g. "₹4,028 / sq.ft"
 */
export const formatPricePerSqFt = (rate) => {
  const num = Math.round(parseFloat(rate) || 0);
  return `₹${num.toLocaleString('en-IN')} / sq.ft`;
};

/**
 * Formats full numeric INR value (e.g. "₹80,19,000").
 *
 * @param {number|string} val
 * @returns {string}
 */
export const formatFullInr = (val) => {
  const num = toNumericInr(val);
  return `₹${formatIndianCommas(num)}`;
};
