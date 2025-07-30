// src/components/BookingForm.jsx (Complete fixed version)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '../config/api';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorBoundary from './ErrorBoundary';

// Import other components...
import { useBlockedDates } from '../hooks/useBlockedDates';
import DateSelectionSection from './booking/DateSelectionSection';
import GuestSelectionSection from './booking/GuestSelectionSection';
import PersonalInfoSection from './booking/PersonalInfoSection';
import PriceDisplay from './booking/PriceDisplay';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const navigate = useNavigate();
  const { blockedDates, loading: datesLoading, error: datesError } = useBlockedDates();
  const { error: apiError, handleError, clearError, withErrorHandling } = useErrorHandler();
  
  // ✅ ALL STATE DECLARATIONS MOVED TO TOP
  // Date and pricing state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [total, setTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  
  // Guest information state
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Booking options state
  const [discountCode, setDiscountCode] = useState('');
  const [paymentType, setPaymentType] = useState('full');
  const [currency, setCurrency] = useState('IDR'); // ✅ Now properly declared before useEffect
  
  // UI state
  const [error, setError] = useState('');
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if booking is within 45 days (force full payment)
  const isWithin45Days = checkInDate && (new Date(checkInDate) - new Date()) / (1000 * 60 * 60 * 24) < 45;

  // Validation helpers - only used when actually submitting
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name.trim());
  };

  const validateBookingForm = () => {
    const errors = [];
    
    if (!checkInDate || !checkOutDate) {
      errors.push('Please select check-in and check-out dates');
    }
    
    if (!validateName(firstName)) {
      errors.push('First name must be at least 2 characters and contain only letters');
    }
    
    if (!validateName(lastName)) {
      errors.push('Last name must be at least 2 characters and contain only letters');
    }
    
    if (!validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (adults < 1) {
      errors.push('At least 1 adult is required');
    }
    
    if (adults + kids > 8) {
      errors.push('Maximum 8 guests (adults + kids) allowed');
    }

    return errors;
  };

  // Updated price calculation with error handling
// client/src/components/BookingForm.jsx - FIXED date handling in useEffect
useEffect(() => {
  if (!checkInDate || !checkOutDate) {
    setTotal(0);
    setDiscountedTotal(0);
    setDiscountApplied(false);
    setError('');
    clearError();
    setShowPaymentFields(false);
    return;
  }

  const calculatePrice = async () => {
    try {
      setIsCalculatingPrice(true);
      setError('');
      clearError();

      // ✅ FIX: Ensure dates are properly formatted as ISO strings
      const checkInISO = checkInDate instanceof Date 
        ? checkInDate.toISOString() 
        : new Date(checkInDate).toISOString();
      
      const checkOutISO = checkOutDate instanceof Date 
        ? checkOutDate.toISOString() 
        : new Date(checkOutDate).toISOString();

      console.log('🔍 FRONTEND DEBUG - Date formatting:', {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        checkInISO: checkInISO,
        checkOutISO: checkOutISO
      });

      // Basic date validation (existing code)
      const normalizedStart = new Date(checkInISO);
      const normalizedEnd = new Date(checkOutISO);
      normalizedStart.setHours(0, 0, 0, 0);
      normalizedEnd.setHours(0, 0, 0, 0);

      // Check for blocked dates (existing code)
      for (let d = new Date(normalizedStart); d < normalizedEnd; d.setDate(d.getDate() + 1)) {
        const isBlocked = blockedDates.some(
          (blocked) =>
            blocked.getFullYear() === d.getFullYear() &&
            blocked.getMonth() === d.getMonth() &&
            blocked.getDate() === d.getDate()
        );
        if (isBlocked) {
          setError('Selected dates include unavailable dates.');
          setTotal(0);
          setDiscountedTotal(0);
          setShowPaymentFields(false);
          return;
        }
      }

      // Check date range limit (existing code)
      if (normalizedEnd > new Date(2027, 1, 1)) {
        setError('Bookings are only available until January 31, 2027.');
        setTotal(0);
        setDiscountedTotal(0);
        setShowPaymentFields(false);
        return;
      }

      // ✅ FIX: Improved API call with proper data formatting
      const result = await withErrorHandling(async () => {
        const priceData = {
          startDate: checkInISO,
          endDate: checkOutISO,
          currency: currency || 'IDR',
          discountCode: discountApplied ? discountCode : ''
        };

        console.log('🔍 FRONTEND DEBUG - Sending price calculation request:', priceData);

        const originalResponse = await api.calculatePrice(priceData);

        let discountResponse = originalResponse;
        if (discountApplied && discountCode) {
          const discountPriceData = {
            ...priceData,
            discountCode: discountCode
          };
          discountResponse = await api.calculatePrice(discountPriceData);
        }

        return { originalResponse, discountResponse };
      });

      setTotal(result.originalResponse.data.total);
      setDiscountedTotal(result.discountResponse.data.total);
      setError('');

    } catch (err) {
      console.error('[ERROR] Calculating price:', err.message);
      
      // ✅ FIX: More specific error messages
      let errorMessage = 'Failed to calculate price. Please try again.';
      
      if (err.message.includes('Invalid')) {
        errorMessage = 'Please check your selected dates and try again.';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Connection error. Please check your internet and try again.';
      } else if (err.message.includes('Server')) {
        errorMessage = 'Server error. Please try again later or contact support.';
      }
      
      setError(errorMessage);
      setTotal(0);
      setDiscountedTotal(0);
      setShowPaymentFields(false);
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  calculatePrice();
}, [checkInDate, checkOutDate, blockedDates, currency, discountApplied, discountCode, withErrorHandling, clearError]);

  // ✅ FIXED: Date change handlers with timezone fix
  const handleCheckInChange = (date) => {
    // Create a new date that represents the same calendar day regardless of timezone
    const normalizedDate = date ? new Date(
      date.getFullYear(),
      date.getMonth(), 
      date.getDate(),
      12, 0, 0, 0  // Set to noon to avoid timezone edge cases
    ) : null;
    
    console.log('🔍 Check-in date:', {
      original: date?.toDateString(),
      normalized: normalizedDate?.toDateString(),
      willSendToAPI: normalizedDate?.toISOString()
    });
    
    setCheckInDate(normalizedDate);
    
    if (normalizedDate && (!checkOutDate || checkOutDate <= normalizedDate)) {
      const minCheckOut = new Date(normalizedDate);
      const isPeakSeason = normalizedDate && (
        (normalizedDate >= new Date(2025, 0, 1) && normalizedDate < new Date(2025, 0, 6)) || 
        (normalizedDate >= new Date(2025, 11, 20))
      );
      minCheckOut.setDate(minCheckOut.getDate() + (isPeakSeason ? 5 : 2));
      setCheckOutDate(minCheckOut);
    }
    
    if (normalizedDate && (new Date(normalizedDate) - new Date()) / (1000 * 60 * 60 * 24) < 45) {
      setPaymentType('full');
    }
    
    // Reset states
    setDiscountApplied(false);
    setDiscountCode('');
    setShowPaymentFields(false);
    setError('');
    clearError();
  };

  const handleCheckOutChange = (date) => {
    // Create a new date that represents the same calendar day regardless of timezone
    const normalizedDate = date ? new Date(
      date.getFullYear(),
      date.getMonth(), 
      date.getDate(),
      12, 0, 0, 0  // Set to noon to avoid timezone edge cases
    ) : null;
    
    console.log('🔍 Check-out date:', {
      original: date?.toDateString(),
      normalized: normalizedDate?.toDateString(),
      willSendToAPI: normalizedDate?.toISOString()
    });
    
    if (normalizedDate && normalizedDate > new Date(2027, 1, 1)) {
      setError('Bookings are only available until January 31, 2027.');
      setCheckOutDate(null);
      setShowPaymentFields(false);
      return;
    }
    
    setCheckOutDate(normalizedDate);
    
    // Reset states
    setDiscountApplied(false);
    setDiscountCode('');
    setShowPaymentFields(false);
    setError('');
    clearError();
  };

  // Updated discount handling with error handling
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setError('Please enter a discount code.');
      setDiscountApplied(false);
      setDiscountedTotal(total);
      setShowPaymentFields(false);
      return;
    }
    
    try {
      setIsCalculatingPrice(true);
      setError('');
      clearError();
      
      const result = await withErrorHandling(async () => {
        return await api.calculatePrice({
          startDate: checkInDate?.toISOString(),
          endDate: checkOutDate?.toISOString(),
          discountCode: discountCode.trim(),
          currency,
        });
      });
      
      setDiscountedTotal(result.data.total);
      setDiscountApplied(true);
      setError('');
      
    } catch (err) {
      setError('Invalid discount code. Please try again.');
      setDiscountApplied(false);
      setDiscountedTotal(total);
      console.error('[ERROR] Applying discount:', err.message);
      setShowPaymentFields(false);
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  // Continue to payment handler
  const handleContinueToPayment = () => {
    if (!checkInDate || !checkOutDate || total === 0) {
      setError('Please select valid check-in and check-out dates.');
      return;
    }

    // Only validate dates at this stage - guest details come later
    setError('');
    clearError();
    setShowPaymentFields(true);
  };

  // Booking success handler
  const handleBookingSuccess = (bookingId) => {
    navigate(`/success?bookingId=${bookingId}`);
  };

  // Loading state for initial load
  if (datesLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-villa-green mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading availability...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-12 max-w-md">
        <h2 className="text-3xl font-bold text-center text-villa-charcoal mb-6 playfair-display">
          Book Villa Pura Bali
        </h2>
        
        {/* Error Display - Enhanced */}
        {(error || apiError || datesError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-600 text-sm">{error || apiError || datesError}</p>
                <button 
                  onClick={() => {
                    setError('');
                    clearError();
                  }}
                  className="text-red-600 text-xs hover:text-red-800 mt-1 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Network Status Indicator */}
        {!navigator.onLine && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <p className="text-yellow-600 text-sm">
              ⚠️ You appear to be offline. Some features may not work correctly.
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Date Selection */}
          <DateSelectionSection
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
            blockedDates={blockedDates}
            loading={datesLoading}
          />

          {/* Price Display */}
          {(total > 0 || isCalculatingPrice) && (
            <div className="space-y-4">
              {isCalculatingPrice ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Calculating price...</p>
                </div>
              ) : (
                <PriceDisplay
                  total={total}
                  discountedTotal={discountedTotal}
                  currency={currency}
                  discountApplied={discountApplied}
                  discountCode={discountCode}
                  paymentType={paymentType}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                />
              )}
            </div>
          )}

          {/* Discount Code Section */}
          {total > 0 && (
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block mb-1 text-villa-charcoal font-semibold text-sm">Discount Code</label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setDiscountCode(newCode);
                    
                    // Only reset states, don't validate on every keystroke
                    if (discountApplied) {
                      setDiscountApplied(false);
                      setDiscountedTotal(total);
                      setShowPaymentFields(false);
                    }
                    
                    // Clear any existing discount-related errors when user starts typing
                    if (error && error.includes('discount')) {
                      setError('');
                    }
                  }}
                  placeholder="Enter discount code if available"
                  className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
                  disabled={isCalculatingPrice}
                />
                {/* Show applied discount status */}
                {discountApplied && (
                  <p className="text-green-600 text-xs mt-1">✓ Discount code applied successfully</p>
                )}
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim() || isCalculatingPrice}
                  className="bg-villa-green text-villa-white py-2 px-4 rounded-md hover:bg-villa-charcoal transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isCalculatingPrice ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Currency Selection */}
          {total > 0 && (
            <div>
              <label className="block mb-1 text-villa-charcoal font-semibold text-sm">Currency</label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setShowPaymentFields(false);
                  setError('');
                  clearError();
                }}
                className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isCalculatingPrice}
              >
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          )}

          {/* Payment Type Selection */}
          {!isWithin45Days && total > 0 && discountCode !== 'TESTFREE' && (
            <div>
              <label className="block mb-1 text-villa-charcoal font-semibold text-sm">Payment Option</label>
              <select
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  setShowPaymentFields(false);
                  setError('');
                  clearError();
                }}
                className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isCalculatingPrice}
              >
                <option value="full">Pay in Full</option>
                <option value="deposit">30% Deposit (70% due 1 month before check-in)</option>
              </select>
            </div>
          )}

          {/* Continue to Payment Button */}
          {total > 0 && !showPaymentFields && (
            <button
              type="button"
              onClick={handleContinueToPayment}
              disabled={isCalculatingPrice || isSubmitting}
              className="w-full bg-villa-green text-villa-white py-3 rounded-md hover:bg-villa-charcoal transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCalculatingPrice ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating...
                </div>
              ) : (
                'Continue to Guest Details'
              )}
            </button>
          )}

          {/* Guest Details and Payment Section */}
          {showPaymentFields && (
            <div className="space-y-6">
              {/* Guest Selection */}
              <GuestSelectionSection
                adults={adults}
                kids={kids}
                setAdults={setAdults}
                setKids={setKids}
                onError={setError}
              />

              {/* Personal Information */}
              <PersonalInfoSection
                firstName={firstName}
                lastName={lastName}
                email={email}
                arrivalTime={arrivalTime}
                specialRequests={specialRequests}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setEmail={setEmail}
                setArrivalTime={setArrivalTime}
                setSpecialRequests={setSpecialRequests}
                validateEmail={validateEmail}
                validateName={validateName}
              />

              {/* Payment Processing */}
              {total >= 0 && (
                <Elements stripe={stripePromise} options={{
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#81C784',
                    }
                  }
                }}>
                  <CheckoutForm
                    bookingDetails={{
                      firstName: firstName.trim(),
                      lastName: lastName.trim(),
                      email: email.trim(),
                      startDate: checkInDate?.toISOString(),
                      endDate: checkOutDate?.toISOString(),
                      adults,
                      kids,
                      total: paymentType === 'deposit' && discountCode !== 'TESTFREE' ? discountedTotal * 0.3 : discountedTotal,
                      arrivalTime,
                      specialRequests,
                      discountCode: discountApplied ? discountCode : '',
                      paymentType,
                      currency,
                    }}
                    onSuccess={handleBookingSuccess}
                    validateBookingForm={validateBookingForm}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    onValidationError={setError}
                  />
                </Elements>
              )}
            </div>
          )}
        </form>

        {/* Help Section */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your booking?
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="text-villa-green hover:underline text-sm"
            >
              Contact Us
            </a>
            <a
              href="/faqs"
              className="text-villa-green hover:underline text-sm"
            >
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BookingForm;