const Booking = require('../models/Booking');

const createBooking = async ({
  guestName, email, checkInDate, checkOutDate, adults, kids,
  total, amountPaid, remainingAmount, arrivalTime, specialRequests,
  discountCode, airportTransfer, paymentType, paymentIntentId, currency = 'IDR',
}) => {
  try {
    const booking = new Booking({
      guestName,
      email,
      checkInDate,
      checkOutDate,
      adults,
      kids,
      total,
      amountPaid,
      remainingAmount,
      arrivalTime: arrivalTime || '14:00',
      specialRequests: specialRequests || '',
      discountCode: discountCode || '',
      airportTransfer,
      paymentType,
      paymentStatus: total > 0 && discountCode !== 'TESTFREE' ? 'pending' : 'completed',
      paymentIntentId,
      currency,
    });
    const savedBooking = await booking.save();
    console.log('[INFO] Booking saved:', savedBooking._id);
    return savedBooking;
  } catch (error) {
    console.error('[ERROR] Failed to save booking:', error.message);
    throw error;
  }
};

const updateBookingStatus = async (bookingId, paymentIntentId, status) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, paymentIntentId },
      { paymentStatus: status },
      { new: true }
    );
    if (!booking) {
      throw new Error(`Booking not found for ID: ${bookingId}`);
    }
    console.log('[INFO] Booking status updated:', { bookingId, paymentIntentId, status });
    return booking;
  } catch (error) {
    console.error('[ERROR] Failed to update booking:', error.message);
    throw error;
  }
};

module.exports = { createBooking, updateBookingStatus };