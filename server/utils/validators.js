const { DateTime } = require('luxon');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'validators' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/validation.log' })
  ]
});

// Helper function for consistent timezone handling
const parseDate = (dateString, fieldName = 'date') => {
  try {
    if (!dateString) {
      throw new Error(`${fieldName} is required`);
    }
    
    // Parse the date in Bali timezone and set to start of day
    const parsedDate = DateTime.fromISO(dateString, { zone: 'Asia/Makassar' });
    
    if (!parsedDate.isValid) {
      throw new Error(`Invalid ${fieldName} format: ${parsedDate.invalidReason}`);
    }
    
    return parsedDate.startOf('day').toJSDate();
  } catch (error) {
    logger.error('Date parsing failed:', {
      dateString,
      fieldName,
      error: error.message
    });
    throw new Error(`Invalid ${fieldName}: ${error.message}`);
  }
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email address is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Invalid email address format');
  }
  
  // Additional email validation
  if (email.length > 254) {
    throw new Error('Email address is too long');
  }
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) {
    throw new Error('Email local part is too long');
  }
  
  return email.trim().toLowerCase();
};

const validateName = (name, fieldName) => {
  if (!name || typeof name !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 1) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  if (trimmedName.length > 50) {
    throw new Error(`${fieldName} is too long (maximum 50 characters)`);
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    throw new Error(`${fieldName} contains invalid characters`);
  }
  
  return trimmedName;
};

const validateGuests = (adults, kids) => {
  const adultsNum = parseInt(adults);
  const kidsNum = parseInt(kids) || 0;
  
  if (isNaN(adultsNum) || adultsNum < 1) {
    throw new Error('At least 1 adult is required');
  }
  
  if (isNaN(kidsNum) || kidsNum < 0) {
    throw new Error('Number of kids cannot be negative');
  }
  
  if (adultsNum > 8) {
    throw new Error('Maximum 8 adults allowed');
  }
  
  if (kidsNum > 8) {
    throw new Error('Maximum 8 kids allowed');
  }
  
  if (adultsNum + kidsNum > 8) {
    throw new Error('Maximum 8 guests total (adults + kids)');
  }
  
  return { adultsNum, kidsNum };
};

const validateDates = (startDate, endDate) => {
  const checkInDate = parseDate(startDate, 'check-in date');
  const checkOutDate = parseDate(endDate, 'check-out date');
  
  if (checkInDate >= checkOutDate) {
    throw new Error('Check-out date must be after check-in date');
  }
  
  // Check minimum stay (1 night)
  const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  if (nights < 1) {
    throw new Error('Minimum stay is 1 night');
  }
  
  // Check maximum stay (365 days)
  if (nights > 365) {
    throw new Error('Maximum stay is 365 days');
  }
  
  // Check if dates are not too far in the past
  const today = DateTime.now().setZone('Asia/Makassar').startOf('day').toJSDate();
  if (checkInDate < today) {
    throw new Error('Check-in date cannot be in the past');
  }
  
  // Check if dates are not too far in the future (2 years)
  const maxFutureDate = DateTime.now().setZone('Asia/Makassar').plus({ years: 2 }).toJSDate();
  if (checkInDate > maxFutureDate) {
    throw new Error('Check-in date cannot be more than 2 years in the future');
  }
  
  return { checkInDate, checkOutDate, nights };
};

const validatePaymentType = (paymentType, checkInDate) => {
  if (!paymentType || !['full', 'deposit'].includes(paymentType)) {
    throw new Error('Payment type must be either "full" or "deposit"');
  }
  
  // Check if deposit is allowed (booking must be at least 45 days in advance)
  if (paymentType === 'deposit') {
    const today = DateTime.now().setZone('Asia/Makassar').startOf('day').toJSDate();
    const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilCheckIn < 45) {
      throw new Error('Bookings within 45 days require full payment');
    }
  }
  
  return paymentType;
};

const validateCurrency = (currency) => {
  const allowedCurrencies = ['IDR', 'AUD', 'USD', 'EUR'];
  
  if (!currency || !allowedCurrencies.includes(currency.toUpperCase())) {
    throw new Error(`Currency must be one of: ${allowedCurrencies.join(', ')}`);
  }
  
  return currency.toUpperCase();
};

const validateDiscountCode = (discountCode) => {
  if (!discountCode) {
    return null;
  }
  
  if (typeof discountCode !== 'string') {
    throw new Error('Discount code must be a string');
  }
  
  const trimmedCode = discountCode.trim().toUpperCase();
  
  if (trimmedCode.length > 20) {
    throw new Error('Discount code is too long');
  }
  
  // Allow only alphanumeric characters
  const codeRegex = /^[A-Z0-9]+$/;
  if (!codeRegex.test(trimmedCode)) {
    throw new Error('Discount code contains invalid characters');
  }
  
  return trimmedCode;
};

const validateAmount = (amount, currency = 'IDR') => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount < 0) {
    throw new Error('Amount must be a positive number');
  }
  
  // Set reasonable limits based on currency
  const limits = {
    IDR: { min: 0, max: 1000000000 }, // 1 billion IDR
    USD: { min: 0, max: 100000 },     // 100k USD
    EUR: { min: 0, max: 100000 },     // 100k EUR
    AUD: { min: 0, max: 100000 }      // 100k AUD
  };
  
  const currencyLimits = limits[currency.toUpperCase()];
  if (!currencyLimits) {
    throw new Error('Invalid currency for amount validation');
  }
  
  if (numAmount > currencyLimits.max) {
    throw new Error(`Amount exceeds maximum limit of ${currencyLimits.max} ${currency}`);
  }
  
  return numAmount;
};

const validateOptionalFields = (arrivalTime, specialRequests) => {
  const validated = {};
  
  if (arrivalTime) {
    if (typeof arrivalTime !== 'string') {
      throw new Error('Arrival time must be a string');
    }
    
    const trimmedTime = arrivalTime.trim();
    if (trimmedTime.length > 10) {
      throw new Error('Arrival time is too long');
    }
    
    // Basic time format validation (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(trimmedTime)) {
      throw new Error('Arrival time must be in HH:MM format');
    }
    
    validated.arrivalTime = trimmedTime;
  }
  
  if (specialRequests) {
    if (typeof specialRequests !== 'string') {
      throw new Error('Special requests must be a string');
    }
    
    const trimmedRequests = specialRequests.trim();
    if (trimmedRequests.length > 500) {
      throw new Error('Special requests are too long (maximum 500 characters)');
    }
    
    validated.specialRequests = trimmedRequests;
  }
  
  return validated;
};

const validateBookingInput = ({
  firstName, lastName, email, startDate, endDate, adults, kids, 
  paymentType, total, discountCode, currency = 'IDR', arrivalTime, specialRequests
}) => {
  try {
    logger.info('Validating booking input:', {
      email: email?.substring(0, 3) + '***', // Partially log email for debugging
      startDate,
      endDate,
      paymentType,
      currency
    });
    
    // Validate names
    const validatedFirstName = validateName(firstName, 'First name');
    const validatedLastName = validateName(lastName, 'Last name');
    
    // Validate email
    const validatedEmail = validateEmail(email);
    
    // Validate dates
    const { checkInDate, checkOutDate, nights } = validateDates(startDate, endDate);
    
    // Validate guests
    const { adultsNum, kidsNum } = validateGuests(adults, kids);
    
    // Validate currency
    const validatedCurrency = validateCurrency(currency);
    
    // Validate payment type (depends on dates)
    const validatedPaymentType = validatePaymentType(paymentType, checkInDate);
    
    // Validate discount code
    const validatedDiscountCode = validateDiscountCode(discountCode);
    
    // Validate total amount
    const validatedTotal = validateAmount(total, validatedCurrency);
    
    // Validate optional fields
    const validatedOptional = validateOptionalFields(arrivalTime, specialRequests);
    
    logger.info('Booking input validation successful:', {
      email: validatedEmail.substring(0, 3) + '***',
      nights,
      guests: adultsNum + kidsNum,
      currency: validatedCurrency,
      paymentType: validatedPaymentType
    });
    
    return {
      firstName: validatedFirstName,
      lastName: validatedLastName,
      email: validatedEmail,
      checkInDate,
      checkOutDate,
      adultsNum,
      kidsNum,
      paymentType: validatedPaymentType,
      currency: validatedCurrency,
      discountCode: validatedDiscountCode,
      total: validatedTotal,
      nights,
      ...validatedOptional
    };
    
  } catch (error) {
    logger.error('Booking input validation failed:', {
      error: error.message,
      email: email?.substring(0, 3) + '***'
    });
    throw error;
  }
};

const validatePaymentConfirmation = ({ paymentIntentId, bookingId }) => {
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    throw new Error('Valid PaymentIntent ID is required');
  }
  
  if (!bookingId || typeof bookingId !== 'string') {
    throw new Error('Valid Booking ID is required');
  }
  
  // Basic format validation for Stripe payment intent ID
  if (!paymentIntentId.startsWith('pi_')) {
    throw new Error('Invalid PaymentIntent ID format');
  }
  
  // Basic format validation for MongoDB ObjectId
  if (bookingId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
    throw new Error('Invalid Booking ID format');
  }
  
  return { paymentIntentId, bookingId };
};

module.exports = { 
  validateBookingInput, 
  validatePaymentConfirmation,
  validateEmail,
  validateName,
  validateGuests,
  validateDates,
  validatePaymentType,
  validateCurrency,
  validateDiscountCode,
  validateAmount,
  validateOptionalFields,
  parseDate
};