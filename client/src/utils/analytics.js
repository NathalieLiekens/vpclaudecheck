export const GA_TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-PLACEHOLDER') {
    console.log('🔍 GA initialized with ID:', GA_TRACKING_ID);
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-PLACEHOLDER') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-PLACEHOLDER') {
    console.log('🔍 GA Event:', { action, category, label, value });
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Villa Pura specific tracking functions
export const villaTracking = {
  // Booking Flow Events
  dateSelected: (checkIn, checkOut) => {
    const nights = checkOut && checkIn ? 
      Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;
    trackEvent('date_selected', 'booking_flow', `${nights}_nights`);
  },

  priceCalculated: (total, currency, nights) => {
    trackEvent('price_calculated', 'booking_flow', currency, Math.round(total));
  },

  discountApplied: (discountCode, originalPrice, discountedPrice) => {
    const savings = originalPrice - discountedPrice;
    trackEvent('discount_applied', 'booking_flow', discountCode, Math.round(savings));
  },

  paymentInitiated: (total, currency, paymentType) => {
    trackEvent('begin_checkout', 'ecommerce', paymentType, Math.round(total));
  },

  bookingCompleted: (bookingId, total, currency, paymentType) => {
    // E-commerce tracking
    trackEvent('purchase', 'ecommerce', bookingId, Math.round(total));
    // Custom tracking
    trackEvent('booking_completed', 'conversion', paymentType, Math.round(total));
  },

  // Content Engagement Events
  galleryViewed: () => {
    trackEvent('gallery_viewed', 'content_engagement', 'photo_gallery');
  },

  pricingViewed: () => {
    trackEvent('pricing_viewed', 'content_engagement', 'pricing_page');
  },

  reviewsViewed: () => {
    trackEvent('reviews_viewed', 'content_engagement', 'reviews_page');
  },

  localGuideViewed: () => {
    trackEvent('local_guide_viewed', 'content_engagement', 'local_guide');
  },

  // Contact & Lead Generation
  contactFormSubmitted: (formType = 'contact_page') => {
    trackEvent('contact_form_submit', 'lead_generation', formType);
  },

  phoneClicked: () => {
    trackEvent('phone_click', 'lead_generation', 'phone_number');
  },

  emailClicked: () => {
    trackEvent('email_click', 'lead_generation', 'email_address');
  },

  // External Links
  externalLinkClicked: (url, linkText) => {
    trackEvent('external_link_click', 'navigation', linkText);
  }
};