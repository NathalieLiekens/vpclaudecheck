import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`);
        // Convert string dates to Date objects
        const booking = {
          ...response.data,
          checkInDate: new Date(response.data.checkInDate),
          checkOutDate: new Date(response.data.checkOutDate),
        };
        setBookingDetails(booking);
      } catch (err) {
        setError('Failed to load booking details.');
        console.error('[ERROR] Fetch booking details error:', err.message);
      }
    };
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  if (!bookingId) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Invalid booking ID.</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  if (!bookingDetails) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  const bookingIdFormatted = `VPB-${bookingDetails.checkInDate.getFullYear()}${(bookingDetails.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${bookingDetails.checkInDate.getDate().toString().padStart(2, '0')}`;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Booking Confirmed!</h2>
      <p>Thank you for your booking at Villa Pura Bali.</p>
      <p><strong>Booking Reference:</strong> {bookingIdFormatted}</p>
      <p><strong>Guest Name:</strong> {bookingDetails.guestName}</p>
      <p><strong>Check-in:</strong> {bookingDetails.checkInDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' })}</p>
      <p><strong>Check-out:</strong> {bookingDetails.checkOutDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' })}</p>
      <p><strong>Total:</strong> {bookingDetails.currency} {bookingDetails.total.toLocaleString('id-ID')}</p>
      <p>A confirmation email has been sent to {bookingDetails.email}.</p>
      <p>We look forward to welcoming you!</p>
    </div>
  );
};

export default SuccessPage;