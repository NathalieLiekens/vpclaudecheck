const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'payment-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/payments.log' })
  ]
});

const createPaymentIntent = async ({ amount, currency, description, receipt_email, metadata }) => {
  if (amount <= 0) {
    logger.info('Skipping payment intent creation for zero or negative amount:', { amount });
    return { clientSecret: null, paymentIntentId: null };
  }
  
  // Validate input parameters
  if (!currency || !['idr', 'usd', 'eur', 'aud'].includes(currency.toLowerCase())) {
    throw new Error('Invalid currency provided');
  }
  
  if (!receipt_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receipt_email)) {
    throw new Error('Valid email address required for receipt');
  }
  
  try {
    // Convert amount to cents and ensure it's an integer
    const amountInCents = Math.round(amount * 100);
    
    // Validate amount limits based on currency
    const minAmounts = { idr: 1000, usd: 0.5, eur: 0.5, aud: 0.5 }; // Minimum amounts
    const maxAmounts = { idr: 999999999, usd: 999999, eur: 999999, aud: 999999 }; // Maximum amounts
    
    const currencyLower = currency.toLowerCase();
    if (amount < minAmounts[currencyLower] || amount > maxAmounts[currencyLower]) {
      throw new Error(`Amount must be between ${minAmounts[currencyLower]} and ${maxAmounts[currencyLower]} ${currency.toUpperCase()}`);
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currencyLower,
      description: description || 'NB test booking',
      receipt_email,
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        service: 'nb-booking'
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Add additional security features
      setup_future_usage: 'off_session', // Prevents saving payment method
      capture_method: 'automatic', // Immediate capture
    });
    
    logger.info('Stripe payment intent created successfully:', { 
      paymentIntentId: paymentIntent.id, 
      currency: currencyLower,
      amount: amount,
      amountInCents: amountInCents,
      status: paymentIntent.status,
      clientId: paymentIntent.client_secret?.substring(0, 20) + '...' // Log partial secret for debugging
    });
    
    return { 
      clientSecret: paymentIntent.client_secret, 
      paymentIntentId: paymentIntent.id 
    };
    
  } catch (error) {
    logger.error('Failed to create payment intent:', {
      error: error.message,
      amount,
      currency,
      receipt_email,
      stripeErrorType: error.type,
      stripeErrorCode: error.code
    });
    
    // Provide user-friendly error messages
    if (error.type === 'StripeCardError') {
      throw new Error('Payment method declined. Please try a different payment method.');
    } else if (error.type === 'StripeInvalidRequestError') {
      throw new Error('Invalid payment request. Please check your payment details.');
    } else if (error.type === 'StripeAPIError') {
      throw new Error('Payment processing temporarily unavailable. Please try again later.');
    } else if (error.type === 'StripeConnectionError') {
      throw new Error('Network error during payment processing. Please try again.');
    } else if (error.type === 'StripeAuthenticationError') {
      throw new Error('Payment configuration error. Please contact support.');
    } else {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }
};

const verifyWebhookEvent = (body, signature) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret not configured');
  }
  
  if (!signature) {
    throw new Error('Webhook signature missing');
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Additional validation
    if (!event.id || !event.type || !event.data) {
      throw new Error('Invalid webhook event structure');
    }
    
    // Log webhook verification success (but not the full event for security)
    logger.info('Webhook signature verified successfully:', {
      eventId: event.id,
      eventType: event.type,
      created: event.created,
      livemode: event.livemode
    });
    
    return event;
    
  } catch (error) {
    logger.error('Webhook signature verification failed:', {
      error: error.message,
      signaturePresent: !!signature,
      bodyLength: body ? body.length : 0
    });
    
    if (error.message.includes('No signatures found')) {
      throw new Error('Webhook signature verification failed: No signatures found');
    } else if (error.message.includes('timestamp too old')) {
      throw new Error('Webhook signature verification failed: Timestamp too old');
    } else if (error.message.includes('signature mismatch')) {
      throw new Error('Webhook signature verification failed: Invalid signature');
    } else {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }
};

const retrievePaymentIntent = async (paymentIntentId) => {
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    throw new Error('Valid payment intent ID required');
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    logger.info('Payment intent retrieved successfully:', {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    
    return paymentIntent;
    
  } catch (error) {
    logger.error('Failed to retrieve payment intent:', {
      paymentIntentId,
      error: error.message,
      stripeErrorType: error.type
    });
    
    if (error.type === 'StripeInvalidRequestError') {
      throw new Error('Payment intent not found or invalid');
    } else {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }
};

const createPaymentIntentForRemainingBalance = async (booking) => {
  try {
    if (!booking) {
      throw new Error('Booking information required');
    }
    
    if (booking.remainingAmount <= 0) {
      throw new Error('No remaining balance to pay');
    }
    
    if (booking.paymentStatus !== 'succeeded') {
      throw new Error('Initial payment must be completed before paying remaining balance');
    }
    
    const amountInCents = Math.round(booking.remainingAmount * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: booking.currency.toLowerCase(),
      description: `NB test - Final payment for ${booking.guestName} (Booking: ${booking._id})`,
      receipt_email: booking.email,
      metadata: {
        bookingId: booking._id.toString(),
        paymentType: 'remaining_balance',
        guestName: booking.guestName,
        originalPaymentIntentId: booking.paymentIntentId,
        checkInDate: booking.checkInDate.toISOString(),
        checkOutDate: booking.checkOutDate.toISOString(),
        created_at: new Date().toISOString(),
        service: 'nathbyte-final-payment'
      },
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: 'off_session',
      capture_method: 'automatic',
    });
    
    logger.info('Remaining balance payment intent created successfully:', {
      paymentIntentId: paymentIntent.id,
      bookingId: booking._id,
      amount: booking.remainingAmount,
      currency: booking.currency,
      guestEmail: booking.email
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
    
  } catch (error) {
    logger.error('Failed to create remaining balance payment intent:', {
      bookingId: booking?._id,
      error: error.message,
      remainingAmount: booking?.remainingAmount,
      currency: booking?.currency
    });
    throw error;
  }
};

// Helper function to validate payment intent status
const validatePaymentIntentStatus = (paymentIntent, expectedStatuses = ['succeeded']) => {
  if (!expectedStatuses.includes(paymentIntent.status)) {
    throw new Error(`Payment intent status is ${paymentIntent.status}, expected ${expectedStatuses.join(' or ')}`);
  }
  return true;
};

// Helper function to safely extract payment intent metadata
const extractPaymentMetadata = (paymentIntent) => {
  try {
    return {
      bookingId: paymentIntent.metadata?.bookingId || null,
      paymentType: paymentIntent.metadata?.paymentType || 'unknown',
      guestName: paymentIntent.metadata?.guestName || 'Unknown Guest',
      originalPaymentIntentId: paymentIntent.metadata?.originalPaymentIntentId || null,
      service: paymentIntent.metadata?.service || 'nathbyte-booking'
    };
  } catch (error) {
    logger.warn('Failed to extract payment metadata:', {
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
    return {};
  }
};

// Function to cancel a payment intent if needed
const cancelPaymentIntent = async (paymentIntentId, reason = 'requested_by_customer') => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment intent ID required');
    }

    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: reason
    });

    logger.info('Payment intent canceled successfully:', {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      cancellationReason: reason
    });

    return paymentIntent;

  } catch (error) {
    logger.error('Failed to cancel payment intent:', {
      paymentIntentId,
      error: error.message,
      reason
    });
    throw new Error(`Failed to cancel payment intent: ${error.message}`);
  }
};

// Function to refund a payment
const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment intent ID required');
    }

    const refundData = {
      payment_intent: paymentIntentId,
      reason: reason,
      metadata: {
        refund_date: new Date().toISOString(),
        service: 'nb-refund'
      }
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundData);

    logger.info('Refund created successfully:', {
      refundId: refund.id,
      paymentIntentId,
      amount: refund.amount / 100,
      currency: refund.currency,
      status: refund.status,
      reason
    });

    return refund;

  } catch (error) {
    logger.error('Failed to create refund:', {
      paymentIntentId,
      amount,
      error: error.message,
      reason
    });
    throw new Error(`Failed to create refund: ${error.message}`);
  }
};

module.exports = { 
  createPaymentIntent, 
  verifyWebhookEvent, 
  retrievePaymentIntent,
  createPaymentIntentForRemainingBalance,
  validatePaymentIntentStatus,
  extractPaymentMetadata,
  cancelPaymentIntent,
  createRefund
};
