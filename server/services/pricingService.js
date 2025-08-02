const axios = require('axios');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'pricing-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/pricing.log' })
  ]
});

const cache = {
  rates: {},
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Fallback exchange rates (approximate IDR rates - update periodically)
const FALLBACK_RATES = {
  IDR: 1,
  USD: 0.000063,  // 1 IDR = ~0.000063 USD
  EUR: 0.000058,  // 1 IDR = ~0.000058 EUR
  AUD: 0.000098   // 1 IDR = ~0.000098 AUD
};

const fetchExchangeRates = async (baseCurrency) => {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cache.rates[baseCurrency] && cache.lastUpdated && (now - cache.lastUpdated < CACHE_DURATION)) {
    logger.info(`Using cached exchange rates for ${baseCurrency}`);
    return cache.rates[baseCurrency];
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      logger.warn('No exchange rate API key provided, using fallback rates');
      return FALLBACK_RATES;
    }

    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { 
        params: apiKey ? { apiKey } : {},
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (!response.data || !response.data.rates) {
      throw new Error('Invalid response from exchange rate API');
    }
    
    // Validate that we have the required currencies
    const requiredCurrencies = ['USD', 'EUR', 'AUD', 'IDR'];
    const missingCurrencies = requiredCurrencies.filter(currency => 
      !response.data.rates[currency] && currency !== baseCurrency
    );
    
    if (missingCurrencies.length > 0) {
      logger.warn(`Missing currencies in API response: ${missingCurrencies.join(', ')}, using fallback for missing currencies`);
      // Merge API rates with fallback rates for missing currencies
      const mergedRates = { ...response.data.rates };
      missingCurrencies.forEach(currency => {
        mergedRates[currency] = FALLBACK_RATES[currency];
      });
      response.data.rates = mergedRates;
    }
    
    cache.rates[baseCurrency] = response.data.rates;
    cache.lastUpdated = now;
    
    logger.info(`Fetched new exchange rates for ${baseCurrency}`, {
      rates: Object.keys(response.data.rates).length,
      currencies: Object.keys(response.data.rates)
    });
    
    return cache.rates[baseCurrency];
    
  } catch (error) {
    logger.error('Failed to fetch exchange rates from API:', {
      error: error.message,
      baseCurrency,
      fallbackUsed: true
    });
    
    // Return fallback rates
    logger.info('Using fallback exchange rates');
    return FALLBACK_RATES;
  }
};

const pricingRules = [
  // 2025
  { start: new Date(2025, 0, 1), end: new Date(2025, 0, 6), season: 'Peak', pricePerNight: 7200000, minNights: 5 },
  { start: new Date(2025, 0, 6), end: new Date(2025, 1, 1), season: 'High', pricePerNight: 6000000, minNights: 2 },
  { start: new Date(2025, 1, 1), end: new Date(2025, 3, 1), season: 'Low', pricePerNight: 4600000, minNights: 2 },
  { start: new Date(2025, 3, 1), end: new Date(2025, 6, 1), season: 'Mid', pricePerNight: 5300000, minNights: 2 },
  { start: new Date(2025, 6, 1), end: new Date(2025, 7, 1), season: 'July', pricePerNight: 6300000, minNights: 2 },
  { start: new Date(2025, 7, 1), end: new Date(2025, 8, 1), season: 'High', pricePerNight: 6000000, minNights: 2 },
  { start: new Date(2025, 8, 1), end: new Date(2025, 10, 2), season: 'Mid', pricePerNight: 5300000, minNights: 2 },
  { start: new Date(2025, 10, 2), end: new Date(2025, 11, 1), season: 'Low', pricePerNight: 4600000, minNights: 2 },
  { start: new Date(2025, 11, 1), end: new Date(2025, 11, 20), season: 'High', pricePerNight: 6000000, minNights: 2 },
  { start: new Date(2025, 11, 20), end: new Date(2026, 0, 1), season: 'Peak', pricePerNight: 7200000, minNights: 5 },
  
  // 2026 - FIXED
  { start: new Date(2026, 0, 1), end: new Date(2026, 0, 6), season: 'Peak', pricePerNight: 6300000, minNights: 5 }, // ✅ FIX: Added missing peak period
  { start: new Date(2026, 0, 6), end: new Date(2026, 1, 1), season: 'High', pricePerNight: 6300000, minNights: 2 }, // ✅ FIX: Changed from original
  { start: new Date(2026, 1, 1), end: new Date(2026, 3, 1), season: 'Low', pricePerNight: 4830000, minNights: 2 },
  { start: new Date(2026, 3, 1), end: new Date(2026, 6, 1), season: 'Mid', pricePerNight: 5565000, minNights: 2 },
  { start: new Date(2026, 6, 1), end: new Date(2026, 7, 1), season: 'July', pricePerNight: 6615000, minNights: 2 },
  { start: new Date(2026, 7, 1), end: new Date(2026, 8, 1), season: 'High', pricePerNight: 6300000, minNights: 2 },
  { start: new Date(2026, 8, 1), end: new Date(2026, 10, 2), season: 'Mid', pricePerNight: 5565000, minNights: 2 },
  { start: new Date(2026, 10, 2), end: new Date(2026, 11, 1), season: 'Low', pricePerNight: 4830000, minNights: 2 },
  { start: new Date(2026, 11, 1), end: new Date(2026, 11, 20), season: 'High', pricePerNight: 6300000, minNights: 2 },
  { start: new Date(2026, 11, 20), end: new Date(2027, 0, 1), season: 'Peak', pricePerNight: 7560000, minNights: 5 },
  
  // 2027 - FIXED
  { start: new Date(2027, 0, 1), end: new Date(2027, 1, 1), season: 'High', pricePerNight: 6615000, minNights: 2 }, // ✅ FIX: Fixed from Peak to High, minNights 5 to 2
  // ✅ FIX: Removed invalid end date rule - booking limit is handled elsewhere
];

console.log('🔍 PRICING RULES DEBUG:');
pricingRules.forEach((rule, index) => {
  console.log(`${index}: ${rule.season} - ${rule.start.toISOString().split('T')[0]} to ${rule.end.toISOString().split('T')[0]} - ${rule.minNights} nights`);
});

const getPricingRules = () => pricingRules;

const calculateTotalPrice = async (startDate, endDate, currency = 'IDR') => {
  try {
    const normalizedStart = new Date(startDate);
    const normalizedEnd = new Date(endDate);
    normalizedStart.setHours(0, 0, 0, 0);
    normalizedEnd.setHours(0, 0, 0, 0);
    
    const nights = (normalizedEnd - normalizedStart) / (1000 * 60 * 60 * 24);
    
    if (nights <= 0) {
      throw new Error('Check-out date must be after check-in date');
    }

    if (normalizedEnd > new Date(2027, 1, 1)) {
      throw new Error('Bookings are only available until January 31, 2027.');
    }

    let totalPrice = 0;
    const missingDates = [];
    
    for (let d = new Date(normalizedStart); d < normalizedEnd; d.setDate(d.getDate() + 1)) {
      const rule = pricingRules.find((r) => d >= r.start && d < r.end);
      if (!rule) {
        missingDates.push(d.toISOString().split('T')[0]);
      } else {
        totalPrice += rule.pricePerNight;
      }
    }
    
    if (missingDates.length > 0) {
      logger.error('No pricing rules found for dates:', missingDates);
      throw new Error(`No pricing rules available for some selected dates: ${missingDates.join(', ')}`);
    }

    // Convert currency if needed
    if (currency !== 'IDR') {
      const rates = await fetchExchangeRates('IDR');
      const rate = rates[currency];
      
      if (!rate) {
        logger.error('Unsupported currency requested:', currency);
        throw new Error(`Unsupported currency: ${currency}. Supported currencies: IDR, USD, EUR, AUD`);
      }
      
      totalPrice = Math.round(totalPrice * rate * 100) / 100; // Round to 2 decimal places
      
      logger.info('Currency conversion applied:', {
        originalAmount: totalPrice / rate,
        convertedAmount: totalPrice,
        fromCurrency: 'IDR',
        toCurrency: currency,
        exchangeRate: rate
      });
    }

    logger.info('Price calculated:', {
      startDate: normalizedStart.toISOString().split('T')[0],
      endDate: normalizedEnd.toISOString().split('T')[0],
      nights,
      totalPrice,
      currency
    });

    return totalPrice;
    
  } catch (error) {
    logger.error('Price calculation failed:', {
      error: error.message,
      startDate,
      endDate,
      currency
    });
    throw error;
  }
};

const applyDiscount = (totalPrice, discountCode) => {
  let finalTotal = totalPrice;
  let airportTransfer = false;

  if (!discountCode) {
    return { finalTotal, airportTransfer };
  }

  const discountCodeUpper = discountCode.toUpperCase();
  
  switch (discountCodeUpper) {
    case 'MEGAN':
      finalTotal = Math.round(totalPrice * 0.95 * 100) / 100; // 5% discount
      airportTransfer = true;
      logger.info('MEGAN discount applied:', { originalPrice: totalPrice, discountedPrice: finalTotal });
      break;
      
    case 'TESTFREE':
      finalTotal = 0;
      airportTransfer = true;
      logger.info('TESTFREE discount applied - booking is free');
      break;
      
    case 'TESTFIVEEUR':
      finalTotal = 5; // Fixed 5 EUR total for testing
      airportTransfer = true;
      logger.info('TESTFIVEEUR discount applied - fixed 5 EUR total');
      break;
      
    default:
      logger.warn('Invalid discount code used:', discountCode);
      // Don't throw error, just ignore invalid codes
      break;
  }

  return { finalTotal, airportTransfer };
};

// Validate pricing rules on startup
const validatePricingRules = () => {
  const issues = [];
  
  for (let i = 0; i < pricingRules.length - 1; i++) {
    const current = pricingRules[i];
    const next = pricingRules[i + 1];
    
    // Check for gaps
    if (current.end.getTime() !== next.start.getTime()) {
      issues.push(`Gap between ${current.season} (ends ${current.end.toISOString().split('T')[0]}) and ${next.season} (starts ${next.start.toISOString().split('T')[0]})`);
    }
    
    // Check for overlaps
    if (current.end > next.start) {
      issues.push(`Overlap between ${current.season} and ${next.season}`);
    }
  }
  
  if (issues.length > 0) {
    logger.warn('Pricing rule validation issues found:', issues);
  } else {
    logger.info('Pricing rules validation passed');
  }
  
  return issues;
};

// Run validation on module load
validatePricingRules();

module.exports = { 
  getPricingRules, 
  calculateTotalPrice, 
  applyDiscount,
  validatePricingRules,
  FALLBACK_RATES
};