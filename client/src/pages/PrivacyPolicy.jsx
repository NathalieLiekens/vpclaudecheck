import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
        Privacy Policy
      </h1>
      <div className="max-w-3xl mx-auto text-villa-charcoal text-base sm:text-lg leading-relaxed">
        <p className="mb-4">
          At Villa Pura Bali, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website (<a href="https://villapurabali.com" className="text-villa-green hover:underline">villapurabali.com</a>).
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Personal Data</strong>: Name, email, phone number, and payment details provided during booking.</li>
          <li><strong>Usage Data</strong>: IP address, browser type, and pages visited, collected via cookies and analytics tools.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Process bookings and payments via our partners (Guesty, Stripe).</li>
          <li>Communicate with you about your stay or inquiries.</li>
          <li>Improve our website and services through analytics.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">3. Data Sharing</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Service Providers</strong>: We share data with Guesty (reservations) and Stripe (payments), who comply with GDPR and CCPA.</li>
          <li><strong>Legal Obligations</strong>: We may disclose data if required by law.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
        <p className="mb-4">
          We use industry-standard encryption and secure servers to protect your data. However, no online transmission is 100% secure.
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access, correct, or delete your personal data.</li>
          <li>Opt out of marketing communications.</li>
          <li>Contact us via the <Link to="/contact" className="text-villa-green hover:underline">Contact page</Link> to exercise these rights.</li>
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your experience. You can manage cookie preferences via your browser settings.
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4">7. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy. Changes will be posted here with the updated date.
        </p>
        <p className="mt-8 text-sm italic">
          Last updated: May 27, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;