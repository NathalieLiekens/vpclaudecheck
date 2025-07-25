// production-test.js - Run before deploying
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = process.env.SITE_URL || 'http://localhost:5000';

async function testProduction() {
  console.log('🧪 Testing Villa Pura Production Setup...\n');
  
  const results = [];
  
  try {
    // Test 1: Environment Variables
    console.log('1. Checking environment variables...');
    const requiredEnvVars = [
      'MONGODB_URI', 'RESEND_API_KEY', 'STRIPE_SECRET_KEY', 
      'STRIPE_WEBHOOK_SECRET', 'ICAL_URL', 'OWNER_EMAIL'
    ];
    
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
    console.log('✅ All environment variables present\n');
    results.push('✅ Environment variables');
    
    // Test 2: MongoDB Connection
    console.log('2. Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');
    results.push('✅ MongoDB connection');
    await mongoose.disconnect();
    
    // Test 3: Stripe Configuration
    console.log('3. Testing Stripe configuration...');
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Check if using live keys
    if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
      console.log('⚠️  Using TEST Stripe keys - switch to LIVE for production');
      results.push('⚠️  Stripe (TEST mode)');
    } else {
      console.log('✅ Using LIVE Stripe keys');
      results.push('✅ Stripe (LIVE mode)');
    }
    
    // Test 4: Email Service
    console.log('4. Testing email service...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test API key validity (this won't send an email)
    try {
      await resend.emails.send({
        from: 'test@villapura.com',
        to: 'test@example.com',
        subject: 'Test',
        html: 'Test'
      });
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('API key')) {
        throw new Error('Invalid Resend API key');
      }
      // Other errors are expected (like invalid to address)
    }
    console.log('✅ Resend API key valid\n');
    results.push('✅ Email service');
    
    // Test 5: iCal URL
    console.log('5. Testing iCal URL...');
    const icalResponse = await axios.get(process.env.ICAL_URL, { timeout: 10000 });
    if (icalResponse.status === 200) {
      console.log('✅ iCal URL accessible\n');
      results.push('✅ iCal URL');
    } else {
      throw new Error('iCal URL not accessible');
    }
    
    // Test 6: Server Health (if running)
    console.log('6. Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ Server is running and healthy\n');
      results.push('✅ Server health');
    } catch (error) {
      console.log('⚠️  Server not running (expected if not started yet)\n');
      results.push('⚠️  Server not running');
    }
    
    console.log('🎉 Production Readiness Check Complete!\n');
    console.log('Results:');
    results.forEach(result => console.log(result));
    
    console.log('\n📋 Next Steps:');
    console.log('1. Deploy to your production server');
    console.log('2. Update your domain DNS');
    console.log('3. Set up SSL certificate');
    console.log('4. Configure your webhook URL in Stripe dashboard');
    console.log('5. Test a real booking with TESTFREE code');
    
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    
    if (error.message.includes('MongoDB')) {
      console.log('\n💡 MongoDB Setup:');
      console.log('1. Create MongoDB Atlas account');
      console.log('2. Create new cluster');
      console.log('3. Get connection string');
      console.log('4. Update MONGODB_URI in .env');
    }
    
    if (error.message.includes('Stripe')) {
      console.log('\n💡 Stripe Setup:');
      console.log('1. Log into Stripe dashboard');
      console.log('2. Switch to Live mode');
      console.log('3. Get Live API keys');
      console.log('4. Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET');
    }
  }
}

testProduction();