const { verifyWebhookEvent } = require('../services/paymentService');
const Booking = require('../models/Booking');
const { sendConfirmationEmails, sendSecondPaymentConfirmation } = require('../services/emailService');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'webhook' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/webhooks.log' })
  ]
});

const WEBHOOK_TOLERANCE = 300; // 5 minutes in seconds

const verifyWebhookTimestamp = (timestamp) => {
  const timestampSeconds = Math.floor(Date.now() / 1000);
  const tolerance = WEBHOOK_TOLERANCE;
  
  if (Math.abs(timestampSeconds - timestamp) > tolerance) {
    throw new Error('Webhook timestamp too old - possible replay attack');
  }
};

// Track processed webhooks to prevent duplicate processing
const processedWebhooks = new Set();
const MAX_PROCESSED_WEBHOOKS = 10000; // Limit memory usage

const addProcessedWebhook = (eventId) => {
  if (processedWebhooks.size >= MAX_PROCESSED_WEBHOOKS) {
    // Clear old entries (simple FIFO)
    const toDelete = Array.from(processedWebhooks).slice(0, 1000);
    toDelete.forEach(id => processedWebhooks.delete(id));
  }
  processedWebhooks.add(eventId);
};

const isWebhookProcessed = (eventId) => {
  return processedWebhooks.has(eventId);
};

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const startTime = Date.now();
  
  try {
    // Verify the webhook event
    const event = verifyWebhookEvent(req.body, sig);
    
    logger.info('Webhook event received:', {
      eventId: event.id,
      eventType: event.type,
      created: event.created,
      livemode: event.livemode
    });
    
    // Verify webhook timestamp to prevent replay attacks
    try {
      verifyWebhookTimestamp(event.created);
    } catch (timestampError) {
      logger.warn('Webhook timestamp verification failed:', {
        eventId: event.id,
        created: event.created,
        error: timestampError.message
      });
      return res.status(400).json({ error: 'Invalid webhook timestamp' });
    }
    
    // Check if we've already processed this webhook
    if (isWebhookProcessed(event.id)) {
      logger.info('Webhook already processed, skipping:', { eventId: event.id });
      return res.json({ received: true, status: 'already_processed' });
    }
    
    // Mark as processed
    addProcessedWebhook(event.id);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object, event.id);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object, event.id);
        break;
        
      case 'payment_intent.requires_action':
        logger.info('Payment requires additional action:', {
          eventId: event.id,
          paymentIntentId: event.data.object.id,
          status: event.data.object.status
        });
        break;
        
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object, event.id);
        break;
        
      default:
        logger.info('Unhandled event type received:', {
          eventId: event.id,
          eventType: event.type
        });
    }
    
    const processingTime = Date.now() - startTime;
    logger.info('Webhook processed successfully:', {
      eventId: event.id,
      eventType: event.type,
      processingTimeMs: processingTime
    });
    
    res.json({ received: true, eventId: event.id });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Webhook processing failed:', {
      error: error.message,
      stack: error.stack,
      processingTimeMs: processingTime,
      signature: sig ? 'present' : 'missing'
    });
    
    // Return appropriate error status
    if (error.message.includes('signature verification failed')) {
      res.status(400).send('Webhook signature verification failed');
    } else if (error.message.includes('timestamp too old')) {
      res.status(400).send('Webhook timestamp too old');
    } else {
      res.status(500).send(`Webhook processing error: ${error.message}`);
    }
  }
};

const handlePaymentSuccess = async (paymentIntent, eventId) => {
  try {
    logger.info('Processing payment success:', {
      eventId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    
    const booking = await Booking.findOne({ 
      paymentIntentId: paymentIntent.id 
    });
    
    if (!booking) {
      logger.error('Booking not found for payment intent:', {
        eventId,
        paymentIntentId: paymentIntent.id
      });
      throw new Error(`Booking not found for payment intent: ${paymentIntent.id}`);
    }
    
    logger.info('Found booking for payment:', {
      eventId,
      bookingId: booking._id,
      guestName: booking.guestName,
      currentStatus: booking.paymentStatus,
      remainingAmount: booking.remainingAmount
    });
    
    // Determine if this is first payment or final payment
    const isFirstPayment = booking.paymentStatus === 'pending';
    const isRemainingPayment = booking.paymentStatus === 'succeeded' && booking.remainingAmount > 0;
    
    if (isFirstPayment) {
      // First payment (deposit or full payment)
      booking.paymentStatus = 'succeeded';
      await booking.save();
      
      logger.info('First payment confirmed:', {
        eventId,
        bookingId: booking._id,
        amountPaid: booking.amountPaid,
        remainingAmount: booking.remainingAmount
      });
      
      try {
        await sendConfirmationEmails(booking);
        logger.info('Confirmation emails sent successfully:', {
          eventId,
          bookingId: booking._id,
          guestEmail: booking.email
        });
      } catch (emailError) {
        logger.error('Failed to send confirmation emails:', {
          eventId,
          bookingId: booking._id,
          error: emailError.message
        });
        // Don't throw - payment was successful even if email failed
      }
      
    } else if (isRemainingPayment) {
      // Final payment for remaining balance
      booking.amountPaid = booking.total;
      booking.remainingAmount = 0;
      await booking.save();
      
      logger.info('Final payment confirmed:', {
        eventId,
        bookingId: booking._id,
        totalAmount: booking.total
      });
      
      try {
        await sendSecondPaymentConfirmation(booking);
        logger.info('Final payment confirmation email sent:', {
          eventId,
          bookingId: booking._id,
          guestEmail: booking.email
        });
      } catch (emailError) {
        logger.error('Failed to send final payment confirmation email:', {
          eventId,
          bookingId: booking._id,
          error: emailError.message
        });
      }
      
    } else {
      logger.warn('Payment received but booking already fully paid or in unexpected state:', {
        eventId,
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
        remainingAmount: booking.remainingAmount,
        paymentIntentId: paymentIntent.id
      });
    }
    
  } catch (error) {
    logger.error('Failed to handle payment success:', {
      eventId,
      paymentIntentId: paymentIntent.id,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

const handlePaymentFailure = async (paymentIntent, eventId) => {
  try {
    logger.info('Processing payment failure:', {
      eventId,
      paymentIntentId: paymentIntent.id,
      lastPaymentError: paymentIntent.last_payment_error?.message
    });
    
    const booking = await Booking.findOne({ 
      paymentIntentId: paymentIntent.id 
    });
    
    if (!booking) {
      logger.error('Booking not found for failed payment:', {
        eventId,
        paymentIntentId: paymentIntent.id
      });
      return;
    }
    
    // Update booking status
    booking.paymentStatus = 'failed';
    await booking.save();
    
    logger.info('Booking marked as payment failed:', {
      eventId,
      bookingId: booking._id,
      guestName: booking.guestName,
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown'
    });
    
    // Here you could implement failure notification emails if needed
    // await sendPaymentFailureNotification(booking);
    
  } catch (error) {
    logger.error('Failed to handle payment failure:', {
      eventId,
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
    throw error;
  }
};

const handlePaymentCanceled = async (paymentIntent, eventId) => {
  try {
    logger.info('Processing payment cancellation:', {
      eventId,
      paymentIntentId: paymentIntent.id
    });
    
    const booking = await Booking.findOne({ 
      paymentIntentId: paymentIntent.id 
    });
    
    if (!booking) {
      logger.error('Booking not found for canceled payment:', {
        eventId,
        paymentIntentId: paymentIntent.id
      });
      return;
    }
    
    // Update booking status
    booking.paymentStatus = 'canceled';
    await booking.save();
    
    logger.info('Booking marked as payment canceled:', {
      eventId,
      bookingId: booking._id,
      guestName: booking.guestName
    });
    
  } catch (error) {
    logger.error('Failed to handle payment cancellation:', {
      eventId,
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
    throw error;
  }
};