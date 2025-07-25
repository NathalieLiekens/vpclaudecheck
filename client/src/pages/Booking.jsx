import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const Booking = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal">
        Book Your Stay
      </h1>
      <BookingForm />
      <div className="mt-4 text-center text-sm sm:text-base">
        <p>
          <Link
            to="/pricing"
            className="text-villa-green hover:underline text-sm sm:text-base link-visible"
          >
            View rates
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Booking;