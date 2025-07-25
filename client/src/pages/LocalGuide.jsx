import React from 'react';

const LocalGuide = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
        Local Area Guide
      </h1>
      <div className="max-w-3xl mx-auto text-villa-charcoal text-base sm:text-lg leading-relaxed">
        <p className="mb-4">
          Pererenan, Bali, offers a perfect blend of serene beaches, vibrant culture, and modern amenities. Explore these nearby attractions during your stay at Villa Pura Bali.
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">Beaches</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Pererenan Beach</strong> (5-min drive): Ideal for surfing and sunset views.</li>
          <li><strong>Echo Beach</strong> (7-min drive): Known for seafood restaurants and lively vibes.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">Dining</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Warung Eny</strong> (3-min drive): Authentic Balinese dishes in a cozy setting.</li>
          <li><strong>Monsieur Spoon</strong> (5-min drive): French bakery for pastries and coffee.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">Activities</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Tanah Lot Temple</strong> (20-min drive): Iconic sea temple with stunning views.</li>
          <li><strong>Canggu Yoga Centre</strong> (10-min drive): Daily yoga classes for all levels.</li>
        </ul>
        <p className="mt-6">
          Contact our team via the <a href="/contact" className="text-villa-green hover:underline">Contact page</a> for personalized recommendations or bookings.
        </p>
      </div>
    </div>
  );
};

export default LocalGuide;