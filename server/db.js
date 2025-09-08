const mongoose = require('mongoose');

async function connectDB() {
  try {
    console.log('=== MONGODB DEBUG ===');
    console.log('ENV MONGODB_URI:', process.env.MONGODB_URI);
    console.log('First 50 chars:', process.env.MONGODB_URI?.substring(0, 50));
    console.log('Contains nathbytedev?', process.env.MONGODB_URI?.includes('nathbytedev'));
    console.log('Contains kimcsa5?', process.env.MONGODB_URI?.includes('kimcsa5'));
    console.log('===================');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectDB };