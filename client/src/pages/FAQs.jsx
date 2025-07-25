import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is the check-in and check-out time?',
      answer: 'Check-in is flexible between 2:00 PM and 10:00 PM, with checkout by 11:00 AM. Need an early arrival or late departure? Just let us know—we can arrange it based on availability and a small fee.',
    },
    {
      question: 'Are pets allowed at Villa Pura Bali?',
      answer: 'We adore pets, but to ensure a comfortable stay for all guests, they aren’t permitted. Please see our <Link to="/terms-and-conditions">Terms and Conditions</Link> for details.',
    },
    {
      question: 'What amenities are included?',
      answer: 'Your stay includes a private pool, high-speed Wi-Fi, a fully equipped gourmet kitchen, air-conditioned bedrooms, and daily housekeeping to keep everything pristine.',
    },
    {
      question: 'How do I cancel a booking?',
      answer: 'Cancellations more than 30 days before check-in receive a full refund minus a 3% admin fee. Within 30 days, you’ll get a 70% refund, but bookings within 10 days are non-refundable. For more details, check our <Link to="/terms-and-conditions">Terms and Conditions</Link>.',
    },
    {
      question: 'Is the villa suitable for events or parties?',
      answer: 'We cherish the villa’s tranquil vibe, so parties or events aren’t allowed unless pre-approved for commercial use. Let us know if you have special plans!',
    },
    {
      question: 'Is there a minimum stay requirement?',
      answer: 'We require a minimum stay of 2 nights to fully enjoy Villa Pura, as we do not accommodate 1-night stays. Contact us via our <Link to="/contact">contact page</Link> to check availability!',
    },
    {
      question: 'Can I arrange airport transfers or local tours?',
      answer: 'Absolutely! Our dedicated Guest Relations Manager can arrange seamless airport transfers or exciting local tours. Just let us know your preferences when booking or reach out via our <Link to="/contact">contact page</Link>.',
    },
    {
      question: 'Is the villa child-friendly?',
      answer: 'Yes, Villa Pura welcomes families! There’s no pool fence, and the pool isn’t supervised, but we offer high chairs upon request. Please inform us in advance to ensure a safe and enjoyable stay for your little ones.',
    },
    {
      question: 'What should I bring for my stay?',
      answer: 'Most essentials are covered with toiletries and towels, but we suggest bringing sunscreen, swimwear, a hat, and bug spray to make the most of Bali’s tropical charm. Let us know if you need anything special!',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-villa-charcoal playfair-display">
        Your FAQs Answered
      </h1>
      <p className="text-lg sm:text-xl text-villa-charcoal text-center mb-8">
        We’re here to ensure your stay at Villa Pura is seamless! Explore our most common questions below, and feel free to reach out if you need more assistance.
      </p>
      <div className="max-w-3xl mx-auto text-villa-charcoal">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border-b border-villa-charcoal/20">
            <button
              className="w-full text-left py-4 text-base sm:text-lg font-semibold flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="text-base sm:text-lg leading-relaxed pb-4">
                {faq.answer.split(/<Link[^>]*>|<\/Link>/).map((part, i) => {
                  if (i % 2 === 0) return part;
                  const isTerms = faq.answer.includes('terms-and-conditions');
                  return (
                    <Link
                      key={i}
                      to={isTerms ? '/terms-and-conditions' : '/contact'}
                      className="text-villa-green hover:underline"
                    >
                      {isTerms ? 'Terms and Conditions' : 'contact page'}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;