// Test script to verify backend functionality
// Run with: node test-backend.js

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Testing Villa Pura Backend...\n');
  
  try {
    // Test 1: Check server is running
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:5000/api/pricing');
    console.log('✅ Server is running\n');
    
    // Test 2: Check blocked dates endpoint
    console.log('2. Testing blocked dates endpoint...');
    const blockedDates = await axios.get(`${BASE_URL}/blocked-dates`);
    console.log(`✅ Blocked dates retrieved: ${blockedDates.data.length} blocked periods\n`);
    
    // Test 3: Test pricing calculation
    console.log('3. Testing pricing calculation...');
    const pricingData = {
      startDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 30 days from now
      endDate: new Date(Date.now() + 125 * 24 * 60 * 60 * 1000),   // 35 days from now
      currency: 'IDR',
      discountCode: ''
    };
    
    const pricing = await axios.post(`${BASE_URL}/bookings/calculate`, pricingData);
    console.log(`✅ Pricing calculated: ${pricing.data.total} ${pricingData.currency} for ${pricing.data.nights} nights\n`);
    
    // Test 4: Test booking creation (with TESTFREE code)
    console.log('4. Testing booking creation...');
    const bookingData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      startDate: pricingData.startDate,
      endDate: pricingData.endDate,
      adults: 2,
      kids: 0,
      total: 0, // Will be overridden by TESTFREE
      discountCode: 'TESTFREE',
      paymentType: 'full',
      currency: 'IDR',
      arrivalTime: '14:00',
      specialRequests: 'Test booking'
    };
    
    const booking = await axios.post(`${BASE_URL}/bookings`, bookingData);
    console.log(`✅ Test booking created: ${booking.data.bookingId}\n`);
    
    // Test 5: Retrieve booking
    console.log('5. Testing booking retrieval...');
    const retrievedBooking = await axios.get(`${BASE_URL}/bookings/${booking.data.bookingId}`);
    console.log(`✅ Booking retrieved: ${retrievedBooking.data.guestName}\n`);
    
    console.log('🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your server is running: npm run dev');
    }
    
    if (error.response?.status === 500) {
      console.log('\n💡 Check your MongoDB connection and environment variables');
    }
  }
}

// Run the test
testBackend();