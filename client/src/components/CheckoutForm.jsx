import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = ({ bookingDetails, onSuccess, validateBookingForm, onValidationError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again.');
      return false;
    }

    // Use the validation function passed from BookingForm
    if (validateBookingForm) {
      const validationErrors = validateBookingForm();
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        if (onValidationError) {
          onValidationError(validationErrors[0]); // Also set error in parent
        }
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      // Log the API URL for debugging
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, bookingDetails, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      // ✅ FIX: Properly extract all response data with error handling
      const responseData = response.data;
      console.log('🔍 CHECKOUT DEBUG - Full response data:', responseData);
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      const { clientSecret, bookingId } = responseData;
      
      // ✅ FIX: Ensure we have bookingId
      if (!bookingId) {
        throw new Error('Booking ID missing from server response');
      }

      // Handle TESTFREE bookings (no payment required)
      if (bookingDetails.discountCode === 'TESTFREE') {
        // ✅ FIX: For free bookings, still call confirm-payment but with special handling
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/confirm-payment`, {
            paymentIntentId: 'TESTFREE_NO_PAYMENT',  // This matches backend expectation
            bookingId,
          });
        } catch (confirmError) {
          console.error('Free booking confirmation error:', confirmError);
          // For free bookings, this might not be critical if webhook already processed
        }
        onSuccess(bookingId);
        return;
      }

      // Handle paid bookings
      if (clientSecret && bookingDetails.total > 0) {
        console.log('🔍 CHECKOUT DEBUG - Processing payment with clientSecret');
        
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
              email: bookingDetails.email,
            },
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        console.log('🔍 CHECKOUT DEBUG - Payment successful, result:', result);
        
        // ✅ FIX: Get paymentIntentId from the Stripe result, not from initial response
        const paymentIntentId = result.paymentIntent.id;
        
        console.log('🔍 CHECKOUT DEBUG - Confirming payment with:', {
          paymentIntentId,
          bookingId
        });

        // Confirm payment with backend (fallback if webhook doesn't work)
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/confirm-payment`, {
            paymentIntentId,  // ✅ FIX: Use correct paymentIntentId from Stripe result
            bookingId,
          });
          console.log('✅ CHECKOUT DEBUG - Payment confirmation successful');
        } catch (confirmError) {
          console.error('❌ CHECKOUT DEBUG - Payment confirmation failed:', confirmError);
          // Log but don't throw - webhook might have already processed this
          console.log('Payment succeeded but confirmation failed - webhook should handle this');
        }
        
        onSuccess(bookingId);
      } else {
        // No payment required but booking created
        console.log('🔍 CHECKOUT DEBUG - No payment required, proceeding to success');
        onSuccess(bookingId);
      }
    } catch (err) {
      console.error('[ERROR] Full error object:', err);
      console.error('[ERROR] Response data:', err.response?.data);
      console.error('[ERROR] Response status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Booking failed. Please try again.';
      
      setError(errorMessage);
      if (onValidationError) {
        onValidationError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Card Element - only show if payment is required */}
      {bookingDetails.total > 0 && bookingDetails.discountCode !== 'TESTFREE' && (
        <div className="border rounded p-4 bg-villa-white">
          <label className="block mb-2 text-villa-charcoal font-semibold text-sm">
            Payment Information
          </label>
          <CardElement 
            className="p-3 border rounded" 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333333',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Your payment information is secure and encrypted.
          </p>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-villa-charcoal mb-2">Booking Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Guest:</span>
            <span>{bookingDetails.firstName} {bookingDetails.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests:</span>
            <span>{bookingDetails.adults} adults, {bookingDetails.kids} kids</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in:</span>
            <span>{new Date(bookingDetails.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out:</span>
            <span>{new Date(bookingDetails.endDate).toLocaleDateString()}</span>
          </div>
          {bookingDetails.paymentType === 'deposit' && bookingDetails.discountCode !== 'TESTFREE' && (
            <div className="flex justify-between text-blue-600">
              <span>Payment Type:</span>
              <span>30% Deposit</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
            <span>
              {bookingDetails.paymentType === 'deposit' && bookingDetails.discountCode !== 'TESTFREE' 
                ? 'Deposit Total:' 
                : 'Total:'}
            </span>
            <span className="text-villa-green">
              {bookingDetails.currency} {parseInt(bookingDetails.total).toLocaleString('id-ID')}
            </span>
          </div>
          {bookingDetails.discountCode && (
            <div className="flex justify-between text-villa-green text-sm">
              <span>Discount Applied:</span>
              <span>{bookingDetails.discountCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !stripe || !elements}
        className="w-full bg-villa-green text-villa-white py-3 rounded-md hover:bg-villa-charcoal transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : bookingDetails.discountCode === 'TESTFREE' ? (
          'Confirm Free Booking'
        ) : bookingDetails.paymentType === 'deposit' ? (
          'Pay Deposit & Book'
        ) : (
          'Pay & Book Now'
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Secured by Stripe • Your payment information is encrypted and secure
        </p>
      </div>

      {/* Terms Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By completing this booking, you agree to our{' '}
          <a href="/terms-and-conditions" className="text-villa-green hover:underline" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;