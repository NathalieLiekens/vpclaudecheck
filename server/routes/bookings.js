const express = require('express');
const { DateTime } = require('luxon');
const { createPaymentIntent } = require('../services/paymentService');
const Booking = require('../models/Booking');
const { calculateTotalPrice, applyDiscount } = require('../services/pricingService');
const { sendConfirmationEmails } = require('../services/emailService');
const { validateBookingInput } = require('../utils/validators');
const { handleError } = require('../utils/errorHandler');
const { checkDateAvailability, getBlockedDates } = require('../services/icalService');
const winston = require('winston');
const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'booking-routes' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/bookings.log' })
  ]
});

// Helper function for consistent timezone handling
const parseDate = (dateString) => {
  return DateTime.fromISO(dateString, { zone: 'Asia/Makassar' }).startOf('day').toJSDate();
};

router.get('/blocked-dates', async (req, res) => {
  try {
    // Get both iCal blocked dates and confirmed bookings
    const [icalBlockedDates, confirmedBookings] = await Promise.all([
      getBlockedDates(),
      Booking.find(
        { paymentStatus: 'succeeded' },
        { checkInDate: 1, checkOutDate: 1 }
      )
    ]);
    
    const bookingBlockedDates = confirmedBookings.map(booking => ({
      start: booking.checkInDate,
      end: booking.checkOutDate,
    }));
    
    const allBlockedDates = [...icalBlockedDates, ...bookingBlockedDates];
    res.json(allBlockedDates);
  } catch (error) {
    logger.error('Failed to fetch blocked dates:', error);
    handleError(res, error, 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Return safe booking data (exclude sensitive payment info)
    const safeBookingData = {
      _id: booking._id,
      guestName: booking.guestName,
      email: booking.email,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adults: booking.adults,
      kids: booking.kids,
      total: booking.total,
      amountPaid: booking.amountPaid,
      remainingAmount: booking.remainingAmount,
      paymentStatus: booking.paymentStatus,
      paymentType: booking.paymentType,
      currency: booking.currency,
      airportTransfer: booking.airportTransfer,
      arrivalTime: booking.arrivalTime,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };
    
    res.json(safeBookingData);
  } catch (error) {
    logger.error('Failed to fetch booking:', error);
    handleError(res, error, 500);
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      startDate,
      endDate,
      adults,
      kids,
      total,
      discountCode,
      paymentType,
      currency,
      arrivalTime,
      specialRequests,
    } = req.body;

    logger.info('New booking request:', { email, startDate, endDate, paymentType });

    // Validate input with proper timezone handling
    const { checkInDate, checkOutDate, adultsNum, kidsNum } = validateBookingInput({
      firstName, lastName, email, startDate, endDate, adults, kids, paymentType, total, discountCode, currency
    });

    // Check date availability with improved overlap detection
    const [blockedDates, existingBookings] = await Promise.all([
      getBlockedDates(),
      Booking.find({
        paymentStatus: 'succeeded',
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
      })
    ]);
    
    if (existingBookings.length > 0) {
      logger.warn('Date conflict detected:', { 
        requestedDates: { checkInDate, checkOutDate },
        conflictingBookings: existingBookings.map(b => ({ 
          id: b._id, 
          checkIn: b.checkInDate, 
          checkOut: b.checkOutDate 
        }))
      });
      throw new Error('Selected dates are not available - conflicts with existing booking');
    }
    
    checkDateAvailability(checkInDate, checkOutDate, blockedDates);

    const guestName = `${firstName} ${lastName}`;
    const totalPrice = await calculateTotalPrice(checkInDate, checkOutDate, currency);
    const { finalTotal, airportTransfer } = applyDiscount(totalPrice, discountCode);

    // Validate total matches expected, except for test codes
    if (!['TESTFIVEEUR', 'TESTFREE'].includes(discountCode) && Math.abs(finalTotal - total) > 0.01) {
      logger.warn('Price mismatch:', { expected: total, calculated: finalTotal, discountCode });
      throw new Error('Total price mismatch - please recalculate');
    }

    let finalTotalAdjusted = finalTotal;
    let amountPaid = finalTotal;
    let remainingAmount = 0;
    
    if (paymentType === 'deposit' && finalTotal > 0) {
      finalTotalAdjusted = Math.round(finalTotal * 0.3 * 100) / 100; // Round to 2 decimal places
      amountPaid = finalTotalAdjusted;
      remainingAmount = finalTotal - finalTotalAdjusted;
    }

    let paymentIntent = { paymentIntentId: null, clientSecret: null };
    
    // Only create payment intent if there's an amount to charge
    if (finalTotalAdjusted > 0 && discountCode !== 'TESTFREE') {
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount: finalTotalAdjusted,
        currency,
        description: `Villa Pura Bali - ${paymentType} payment for ${guestName}`,
        receipt_email: email,
        metadata: { 
          bookingType: paymentType,
          guestName: guestName,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          totalAmount: finalTotal.toString(),
          discountCode: discountCode || 'none'
        },
      });
      paymentIntent = { paymentIntentId, clientSecret };
    } else {
      amountPaid = 0;
      remainingAmount = 0;
    }

    const booking = new Booking({
      guestName,
      email,
      checkInDate,
      checkOutDate,
      adults: adultsNum,
      kids: kidsNum,
      total: finalTotal,
      amountPaid,
      remainingAmount,
      currency,
      paymentType,
      paymentIntentId: paymentIntent.paymentIntentId || 'TESTFREE_NO_PAYMENT',
      paymentStatus: discountCode === 'TESTFREE' ? 'succeeded' : 'pending',
      discountCode,
      airportTransfer,
      arrivalTime,
      specialRequests,
    });

    await booking.save();
    logger.info('Booking created:', { bookingId: booking._id, guestName, email });

    // For test bookings or free bookings, send emails immediately
    if (discountCode === 'TESTFREE') {
      await sendConfirmationEmails(booking);
    }

    // Return safe response without sensitive payment data
    res.json({
      bookingId: booking._id,
      requiresPayment: finalTotalAdjusted > 0 && discountCode !== 'TESTFREE',
      // Only include clientSecret if payment is required
      ...(finalTotalAdjusted > 0 && discountCode !== 'TESTFREE' && { 
        clientSecret: paymentIntent.clientSecret 
      })
    });

  } catch (error) {
    logger.error('Booking creation failed:', { error: error.message, stack: error.stack });
    handleError(res, error, 400);
  }
});

// Fallback endpoint for frontend payment confirmation (webhooks are primary)
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    
    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({ error: 'Payment intent ID and booking ID required' });
    }
    
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify the payment intent belongs to this booking
    if (booking.paymentIntentId !== paymentIntentId) {
      logger.warn('Payment intent mismatch:', { bookingId, providedPI: paymentIntentId, expectedPI: booking.paymentIntentId });
      return res.status(400).json({ error: 'Payment intent mismatch' });
    }

    // Only update if webhook hasn't already processed this
    if (booking.paymentStatus === 'pending') {
      booking.paymentStatus = 'succeeded';
      await booking.save();
      await sendConfirmationEmails(booking);
      logger.info('Payment confirmed via fallback endpoint:', { bookingId, paymentIntentId });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Payment confirmation failed:', error);
    handleError(res, error, 500);
  }
});

// server/routes/bookings.js - FIXED /calculate endpoint
router.post('/calculate', async (req, res) => {
  try {
    // 🔍 DEBUG: Log everything about the request
    console.log('🔍 BACKEND DEBUG - Full request details:');
    console.log('- Headers:', req.headers);
    console.log('- Content-Type:', req.headers['content-type']);
    console.log('- Body:', req.body);
    console.log('- Body type:', typeof req.body);
    console.log('- Body keys:', Object.keys(req.body || {}));
    
    // ✅ FIX: Check if request body exists and is an object
    if (!req.body || typeof req.body !== 'object') {
      console.error('❌ BACKEND DEBUG - Invalid request body:', req.body);
      return res.status(400).json({ 
        error: 'Invalid request body',
        debug: { 
          receivedBody: req.body, 
          bodyType: typeof req.body,
          contentType: req.headers['content-type']
        }
      });
    }
    
    const { startDate, endDate, discountCode, currency } = req.body;
    
    console.log('🔍 BACKEND DEBUG - Extracted values:');
    console.log('- startDate:', startDate, '(type:', typeof startDate, ')');
    console.log('- endDate:', endDate, '(type:', typeof endDate, ')');
    console.log('- currency:', currency, '(type:', typeof currency, ')');
    console.log('- discountCode:', discountCode, '(type:', typeof discountCode, ')');
    
    // ✅ FIX: More specific validation with better error messages
    if (!startDate || startDate === '') {
      console.error('❌ BACKEND DEBUG - Missing or empty startDate');
      return res.status(400).json({ 
        error: 'Start date is required and cannot be empty',
        debug: { 
          receivedBody: req.body, 
          startDate: startDate,
          startDateType: typeof startDate
        }
      });
    }
    
    if (!endDate || endDate === '') {
      console.error('❌ BACKEND DEBUG - Missing or empty endDate');
      return res.status(400).json({ 
        error: 'End date is required and cannot be empty',
        debug: { 
          receivedBody: req.body, 
          endDate: endDate,
          endDateType: typeof endDate
        }
      });
    }
    
    console.log('🔍 BACKEND DEBUG - Attempting to parse dates...');
    
    // ✅ FIX: Improved date parsing with better error handling
    let checkInDate, checkOutDate;
    try {
      // Use parseDate helper function which handles timezone correctly
      checkInDate = parseDate(startDate);
      console.log('🔍 BACKEND DEBUG - Parsed checkInDate:', checkInDate);
    } catch (dateError) {
      console.error('❌ BACKEND DEBUG - Error parsing startDate:', dateError.message);
      return res.status(400).json({ 
        error: `Invalid start date format: ${dateError.message}`,
        debug: { 
          startDate, 
          error: dateError.message,
          expectedFormat: 'ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)'
        }
      });
    }
    
    try {
      checkOutDate = parseDate(endDate);
      console.log('🔍 BACKEND DEBUG - Parsed checkOutDate:', checkOutDate);
    } catch (dateError) {
      console.error('❌ BACKEND DEBUG - Error parsing endDate:', dateError.message);
      return res.status(400).json({ 
        error: `Invalid end date format: ${dateError.message}`,
        debug: { 
          endDate, 
          error: dateError.message,
          expectedFormat: 'ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)'
        }
      });
    }
    
    // ✅ FIX: Validate date logic
    if (checkInDate >= checkOutDate) {
      console.error('❌ BACKEND DEBUG - Invalid date range');
      return res.status(400).json({ 
        error: 'Check-out date must be after check-in date',
        debug: { 
          checkInDate: checkInDate.toISOString(), 
          checkOutDate: checkOutDate.toISOString(),
          parsedFromStartDate: startDate,
          parsedFromEndDate: endDate
        }
      });
    }
    
    // ✅ FIX: Validate currency with default fallback
    const validatedCurrency = currency && ['IDR', 'USD', 'EUR', 'AUD'].includes(currency.toUpperCase()) 
      ? currency.toUpperCase() 
      : 'IDR';
    
    console.log('🔍 BACKEND DEBUG - Calculating price...');
    const totalPrice = await calculateTotalPrice(checkInDate, checkOutDate, validatedCurrency);
    console.log('🔍 BACKEND DEBUG - Base price calculated:', totalPrice);
    
    const { finalTotal, airportTransfer } = applyDiscount(totalPrice, discountCode);
    console.log('🔍 BACKEND DEBUG - After discount:', { finalTotal, airportTransfer });
    
    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const response = { 
      total: finalTotal, 
      airportTransfer,
      nights,
      baseTotal: totalPrice,
      pricePerNight: Math.round(totalPrice / nights),
      currency: validatedCurrency,
      discountCode: discountCode || null,
      // ✅ ADD: Debug info for troubleshooting
      debug: {
        receivedDates: { startDate, endDate },
        parsedDates: { 
          checkInDate: checkInDate.toISOString(), 
          checkOutDate: checkOutDate.toISOString() 
        },
        calculatedNights: nights
      }
    };
    
    console.log('✅ BACKEND DEBUG - Sending successful response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('❌ BACKEND DEBUG - Unexpected error:', error.message);
    console.error('❌ BACKEND DEBUG - Error stack:', error.stack);
    console.error('❌ BACKEND DEBUG - Request body was:', req.body);
    
    res.status(500).json({ 
      error: error.message || 'Internal server error during price calculation',
      debug: {
        requestBody: req.body,
        errorMessage: error.message,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Endpoint for second payment (remaining balance)
router.post('/pay-remaining', async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.remainingAmount <= 0) {
      return res.status(400).json({ error: 'No remaining balance to pay' });
    }
    
    if (booking.paymentStatus !== 'succeeded') {
      return res.status(400).json({ error: 'Initial payment not confirmed' });
    }
    
    const { createPaymentIntentForRemainingBalance } = require('../services/paymentService');
    const { clientSecret, paymentIntentId } = await createPaymentIntentForRemainingBalance(booking);
    
    // Update booking with new payment intent for remaining balance
    booking.paymentIntentId = paymentIntentId;
    await booking.save();
    
    logger.info('Remaining balance payment intent created:', { bookingId, paymentIntentId, amount: booking.remainingAmount });
    
    res.json({
      clientSecret,
      amount: booking.remainingAmount,
      currency: booking.currency
    });
    
  } catch (error) {
    logger.error('Remaining payment creation failed:', error);
    handleError(res, error, 500);
  }
});

module.exports = router;