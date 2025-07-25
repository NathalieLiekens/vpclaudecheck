require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const bookingRoutes = require('./routes/bookings');
const { getBlockedDates } = require('./services/icalService');
const { getPricingRules } = require('./services/pricingService');
const { sendSecondPaymentReminder, sendPreArrivalEmail } = require('./services/emailService');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Setup logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'villa-pura-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI', 'RESEND_API_KEY', 'STRIPE_SECRET_KEY', 
  'STRIPE_WEBHOOK_SECRET', 'ICAL_URL', 'OWNER_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log environment variables (excluding sensitive ones)
logger.info('Environment variables loaded:', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
  SITE_URL: process.env.SITE_URL,
  ICAL_URL: process.env.ICAL_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing',
  OWNER_EMAIL: process.env.OWNER_EMAIL,
  EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY ? 'Set' : 'Missing',
});

// Updated CORS configuration in server/index.js
const corsOptions = {
  origin: 'https://villapurabali.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'stripe-signature',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};
app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // ✅ FIX: Increased from 10 to 20 booking attempts per IP
  message: { error: 'Too many booking attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// ✅ FIX: Enhanced middleware setup with better logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.get('Origin')} - Content-Type: ${req.get('Content-Type')}`);
  next();
});

app.use(generalLimiter);

// ✅ FIX: Special handling for webhook route (raw body needed)
app.use('/webhook', express.raw({ type: 'application/json' })); 

// ✅ FIX: Enhanced body parsing with size limits and error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ FIX: Add error handling middleware for JSON parsing errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('JSON parsing error:', error.message);
    return res.status(400).json({ 
      error: 'Invalid JSON in request body',
      details: error.message 
    });
  }
  next();
});

// Connect to database
connectDB();

// Routes with enhanced error handling
app.use('/api/bookings', bookingLimiter, bookingRoutes);

// ✅ FIX: Enhanced error logging for all routes
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    console.log(`API Request: ${req.method} ${req.url}`, {
      body: req.body,
      headers: req.headers,
      query: req.query
    });
  }
  next();
})

// Stripe webhook endpoint
app.post('/webhook', require('./routes/webhook'));

// Endpoints for blocked dates and pricing rules
app.get('/api/blocked-dates', async (req, res) => {
  try {
    const blockedDates = await getBlockedDates();
    res.json(blockedDates);
  } catch (error) {
    logger.error('Failed to fetch blocked dates:', error);
    res.status(500).json({ error: 'Failed to fetch blocked dates' });
  }
});

app.get('/api/pricing', (req, res) => {
  try {
    const pricingRules = getPricingRules();
    res.json(pricingRules);
  } catch (error) {
    logger.error('Failed to fetch pricing rules:', error);
    res.status(500).json({ error: 'Failed to fetch pricing rules' });
  }
});

// iCal cache update every hour
let cachedBlockedDates = [];
cron.schedule('0 * * * *', async () => {
  try {
    cachedBlockedDates = await getBlockedDates();
    logger.info('iCal cache updated:', {
      count: cachedBlockedDates.length,
      dates: cachedBlockedDates.map(d => ({
        start: new Date(d.start).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' }),
        end: new Date(d.end).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' }),
      }))
    });
  } catch (error) {
    logger.error('Failed to update iCal cache:', error);
  }
});

// Fixed daily email tasks - runs at 9 AM Bali time
cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Running daily email tasks...');
    
    const Booking = require('./models/Booking');
    const now = new Date();
    
    // Find bookings with outstanding balances
    const bookingsWithBalance = await Booking.find({
      paymentType: 'deposit',
      paymentStatus: 'succeeded',
      remainingAmount: { $gt: 0 }
    });
    
    let remindersSent = 0;
    
    for (const booking of bookingsWithBalance) {
      // Calculate final payment due date (28 days before check-in)
      const finalPaymentDue = new Date(booking.checkInDate.getTime() - 28 * 24 * 60 * 60 * 1000);
      const daysUntilDue = Math.ceil((finalPaymentDue - now) / (1000 * 60 * 60 * 24));
      
      // Send reminders at 7 days and 1 day before due date
      if (daysUntilDue === 7 || daysUntilDue === 1) {
        try {
          await sendSecondPaymentReminder(booking, daysUntilDue);
          remindersSent++;
          logger.info(`Payment reminder sent for booking ${booking._id}, ${daysUntilDue} days before due`);
        } catch (error) {
          logger.error(`Failed to send payment reminder for booking ${booking._id}:`, error);
        }
      }
    }
    
    // Pre-arrival emails (2 days before check-in)
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const bookingsForPreArrival = await Booking.find({
      paymentStatus: 'succeeded',
      checkInDate: {
        $gte: twoDaysFromNow,
        $lt: threeDaysFromNow
      }
    });
    
    let preArrivalEmailsSent = 0;
    
    for (const booking of bookingsForPreArrival) {
      try {
        await sendPreArrivalEmail(booking);
        preArrivalEmailsSent++;
        logger.info(`Pre-arrival email sent for booking ${booking._id}`);
      } catch (error) {
        logger.error(`Failed to send pre-arrival email for booking ${booking._id}:`, error);
      }
    }
    
    logger.info(`Daily email tasks completed: ${remindersSent} payment reminders, ${preArrivalEmailsSent} pre-arrival emails sent`);
  } catch (error) {
    logger.error('Failed to run daily email tasks:', error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Villa Pura Bali API is running', 
    endpoints: {
      health: '/health',
      pricing: '/api/pricing',
      blockedDates: '/api/blocked-dates',
      bookings: '/api/bookings'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(process.env.PORT || 5001, () => {
  logger.info(`Server running on port ${process.env.PORT || 5001}`);
  logger.info(`Health check: http://localhost:${process.env.PORT || 5001}/health`);
  logger.info(`API endpoints: http://localhost:${process.env.PORT || 5001}/api`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${process.env.PORT || 5001} is already in use`);
    process.exit(1);
  } else {
    logger.error('Server error:', error);
    process.exit(1);
  }
});
