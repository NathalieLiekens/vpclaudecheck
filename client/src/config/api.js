// src/config/api.js - FIXED VERSION
import axios from 'axios';

const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.villapurabali.com',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
};

// Validate required environment variables
if (!config.apiUrl) {
  console.error('❌ VITE_API_URL environment variable is not set');
}

if (!config.stripeKey) {
  console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY environment variable is not set');
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🌐 Request Data:`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    console.error('❌ Response Status:', error.response?.status);
    console.error('❌ Response Data:', error.response?.data);
    
    // Network error (no response)
    if (!error.response) {
      const networkError = new Error('Network error - please check your connection and try again');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    // CORS error detection
    if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
      const corsError = new Error('Connection error - please try again or contact support');
      corsError.isCorsError = true;
      return Promise.reject(corsError);
    }
    
    // Server errors
    const status = error.response.status;
    let userMessage;
    
    switch (status) {
      case 400:
        userMessage = error.response.data?.error || error.response.data?.message || 'Invalid request - please check your information';
        break;
      case 401:
        userMessage = 'Authentication required';
        break;
      case 403:
        userMessage = 'Access denied';
        break;
      case 404:
        userMessage = 'Service not found - please try again later';
        break;
      case 429:
        userMessage = 'Too many requests - please wait a moment and try again';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        userMessage = 'Server error - please try again later or contact support';
        break;
      default:
        userMessage = error.response.data?.error || error.response.data?.message || 'An unexpected error occurred';
    }
    
    const enhancedError = new Error(userMessage);
    enhancedError.originalError = error;
    enhancedError.status = status;
    
    return Promise.reject(enhancedError);
  }
);

// API methods with error handling
export const api = {
  // Bookings
  getBookings: () => apiClient.get('/api/bookings'),
  
  createBooking: (bookingData) => apiClient.post('/api/bookings', bookingData),
  
  getBooking: (bookingId) => apiClient.get(`/api/bookings/${bookingId}`),
  
  calculatePrice: async (priceData) => {
    // 🔍 DEBUG: Log the incoming data
    console.log('🔍 API.JS DEBUG - Original priceData received:', priceData);
    
    // ✅ FIX: Ensure proper date formatting and data structure
    const requestData = {
      startDate: priceData.startDate instanceof Date 
        ? priceData.startDate.toISOString() 
        : priceData.startDate,
      endDate: priceData.endDate instanceof Date 
        ? priceData.endDate.toISOString() 
        : priceData.endDate,
      currency: priceData.currency || 'IDR',
      discountCode: priceData.discountCode || ''
    };

    console.log('🔍 API.JS DEBUG - Formatted request data:', requestData);
    
    // ✅ FIX: Validate required fields before sending
    if (!requestData.startDate) {
      throw new Error('Start date is required');
    }
    if (!requestData.endDate) {
      throw new Error('End date is required');
    }

    try {
      console.log('🔍 API.JS DEBUG - Making API call to /api/bookings/calculate');
      
      const response = await apiClient.post('/api/bookings/calculate', requestData);
      
      console.log('✅ API.JS DEBUG - Success response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ API.JS DEBUG - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData: requestData
      });
      throw error;
    }
  },
  
  confirmPayment: (paymentData) => apiClient.post('/api/bookings/confirm-payment', paymentData),
  
  // Blocked dates
  getBlockedDates: () => apiClient.get('/api/blocked-dates'),
  
  // Pricing rules
  getPricingRules: () => apiClient.get('/api/pricing-rules'),
  
  createPricingRule: (ruleData) => apiClient.post('/api/bookings/pricing-rules', ruleData),
  
  // Admin functions
  uploadIcal: (formData) => apiClient.post('/api/bookings/upload-ical', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default config;