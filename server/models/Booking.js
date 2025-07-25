const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  adults: { type: Number, required: true },
  kids: { type: Number, default: 0 },
  total: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 }, 
  remainingAmount: { type: Number, default: 0 },
  arrivalTime: { type: String },
  specialRequests: { type: String },
  discountCode: { type: String },
  airportTransfer: { type: Boolean, default: false },
  paymentType: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  paymentIntentId: { type: String },
  currency: { type: String, default: 'IDR' },
}, { timestamps: true });

// Add indexes for better query performance
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ paymentStatus: 1, paymentType: 1 });
bookingSchema.index({ paymentIntentId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ paymentStatus: 1, remainingAmount: 1, checkInDate: 1 }); // For cron jobs

module.exports = mongoose.model('Booking', bookingSchema);