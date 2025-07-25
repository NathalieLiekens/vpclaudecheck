import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
        Pricing
      </h1>
      <div className="max-w-3xl mx-auto text-villa-charcoal text-base sm:text-lg leading-relaxed">
        <p className="mb-4">
          Rates at Villa Pura Bali vary by date and length of stay. Final pricing is provided during booking via our <Link to="/booking" className="text-villa-green hover:underline">Booking page</Link>.
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">Standard Rates</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Jan 1–5, Dec 20–31</strong>: 7,200,000 IDR/night (5-night minimum)</li>
          <li><strong>Jan 6–31, Aug, Dec 1–19</strong>: 6,000,000 IDR/night</li>
          <li><strong>July</strong>: 6,300,000 IDR/night</li>
          <li><strong>Apr, May, Jun, Sep, Oct</strong>: 5,300,000 IDR/night</li>
          <li><strong>Feb, Mar, Nov</strong>: 4,600,000 IDR/night</li>
          <li>Minimum stay: 2 nights (5 nights for Jan 1–5, Dec 20–31)</li>
          <li>Maximum 8 guests (adults + kids)</li>
        </ul>
        <p className="mt-6 italic text-sm">
          Note: Rates may differ on Airbnb. Contact us for direct booking options.
          These rates are current for 2025. Rate increases may not be published on this page yet for coming years, increase will however be calculated and visible on booking page.
        </p>
      </div>
    </div>
  );
};

export default Pricing;