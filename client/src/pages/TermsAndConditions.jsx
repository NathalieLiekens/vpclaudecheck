import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
        Terms and Conditions
      </h1>
      <div className="max-w-3xl mx-auto text-villa-charcoal text-base sm:text-lg leading-relaxed">
        <p className="mb-4">
          Welcome to Villa Pura Bali. By booking or staying at our property, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">1. Booking and Reservations</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Bookings are made through our website (<a href="https://villapurabali.com" className="text-villa-green hover:underline">villapurabali.com</a>) and managed via our property management system.</li>
          <li>Guests must be 18+ to book. Maximum occupancy is 8 guests, including children.</li>
          <li>Check-in: 2:00 PM–10:00 PM. Checkout: Before 11:00 AM. Early/late check-in/out is subject to availability and may incur fees.</li>
          <li>Bookings are confirmed upon receipt of full payment or a deposit, as specified during checkout.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">2. Payment Terms</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Payments are processed securely via Stripe, accepting major credit/debit cards (Visa, Mastercard, Amex) and digital wallets (e.g., Apple Pay, Google Pay), subject to availability in your region.</li>
          <li>Full payment is required at booking for stays under 7 nights. For longer stays, a 50% deposit is due at booking, with the balance due 30 days before check-in.</li>
          <li>All rates are in USD and include applicable taxes and fees, as displayed during checkout.</li>
          <li>Payment disputes or chargebacks must be raised within 60 days of the transaction, per Stripe’s policies.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">3. Cancellation and Refund Policy</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Standard Cancellations</strong>: Cancellations 30+ days before check-in receive a 50% refund of the paid amount. Cancellations within 30 days are non-refundable.</li>
          <li><strong>Force Majeure</strong>: If travel is prohibited due to government restrictions or natural disasters, guests may reschedule or receive a credit for a future stay, subject to availability.</li>
          <li>Refunds are processed via Stripe to the original payment method within 5–10 business days.</li>
          <li>No refunds for early departures, no-shows, or changes in guest numbers.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">4. House Rules</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>No Pets</strong>: Pets are not allowed on the property.</li>
          <li><strong>No Parties/Events</strong>: Unauthorized parties or events are prohibited.</li>
          <li><strong>Smoking</strong>: Smoking is permitted only in designated outdoor areas. Indoor smoking incurs a $200 cleaning fee.</li>
          <li><strong>Damages</strong>: Guests are responsible for any loss, damage, or breakages. Repair/replacement costs will be charged via Stripe.</li>
          <li>Guests must comply with local laws and respect neighbors (e.g., noise restrictions after 10:00 PM).</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">5. Property Usage</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>The villa is for residential use only. Commercial activities (e.g., photoshoots, filming) require prior approval and may incur fees.</li>
          <li>Amenities (pool, Wi-Fi, kitchen) are provided as described. Maintenance issues must be reported promptly.</li>
          <li>Guests use the pool and facilities at their own risk. Children must be supervised.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">6. Liability</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Villa Pura Bali is not liable for personal injury, loss, or damage to personal belongings during your stay.</li>
          <li>We are not responsible for disruptions due to force majeure (e.g., natural disasters, power outages).</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">7. Privacy and Data</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Guest data (name, email, payment details) is collected for booking purposes and stored securely, per our Privacy Policy.</li>
          <li>Data may be shared with Stripe (for payments) and Guesty (for reservations), complying with GDPR and local laws.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of Indonesia. Disputes will be resolved in the courts of Bali, Indonesia.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">9. Contact</h2>
        <p className="mb-4">
          For questions, contact us via <a href="/contact" className="text-villa-green hover:underline">our contact page</a> or through the Tidio chatbot.
        </p>

        <p className="mt-8 text-sm italic">
          Last updated: May 27, 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;