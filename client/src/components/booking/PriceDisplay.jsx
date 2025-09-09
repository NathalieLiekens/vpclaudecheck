// In client/src/components/booking/PriceDisplay.jsx:

import React from 'react';

const PriceDisplay = ({
  total,
  discountedTotal,
  currency,
  discountApplied,
  discountCode,
  paymentType,
  checkInDate,
  checkOutDate
}) => {
  if (total === 0) return null;

  const nights = checkInDate && checkOutDate 
    ? (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    : 0;

  const depositAmount = paymentType === 'deposit' 
    ? Math.round(discountedTotal * 0.3 * 100) / 100
    : discountedTotal;

  // Calculate donation amount for COOPS5
  const donationAmount = discountCode?.toUpperCase() === 'COOPS5' 
    ? Math.round(discountedTotal * 0.05 * 100) / 100
    : 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      {/* Show original price only when discount is applied AND prices are different */}
      {discountApplied && total !== discountedTotal && (
        <p className="text-lg text-villa-charcoal">
          <span className="line-through text-gray-500">
            Original: {currency} {parseInt(total).toLocaleString('id-ID')}
          </span>
        </p>
      )}
      
      <p className="text-xl text-villa-charcoal font-semibold">
        {discountApplied && total !== discountedTotal ? 'Discounted Total' : 'Total'}: 
        <span className="text-villa-green ml-2">
          {currency} {parseInt(discountedTotal).toLocaleString('id-ID')}
        </span>
      </p>
      
      <p className="text-sm text-gray-600">
        for {nights} night{nights !== 1 ? 's' : ''}
      </p>
      
      {/* Specific discount messages */}
      {discountApplied && discountCode && total !== discountedTotal && (
        <>
          {discountCode.toUpperCase() === 'MEGAN' && (
            <p className="text-sm text-villa-green">✓ 5% discount applied</p>
          )}
          {discountCode.toUpperCase() === 'COOPS' && (
            <>
              <p className="text-sm text-villa-green">✓ 5% discount applied</p>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  🏁 <strong>Cooper Horne Racing #28</strong> - An additional 5% of your payment 
                  ({currency} {donationAmount.toLocaleString('id-ID', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}) will be donated to support the racing team!
                </p>
              </div>
            </>
          )}
          {discountCode.toUpperCase() === 'TESTFREE' && (
            <p className="text-sm text-villa-green">✓ Free booking (test mode)</p>
          )}
          {/* Generic message for other discount codes */}
          {!['MEGAN', 'COOPS5', 'TESTFREE'].includes(discountCode.toUpperCase()) && (
            <p className="text-sm text-villa-green">✓ Discount code applied</p>
          )}
        </>
      )}
      
      {paymentType === 'deposit' && (
        <p className="text-sm text-blue-600">
          30% deposit: {currency} {depositAmount.toLocaleString('id-ID', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
          <br />
          <span className="text-xs text-gray-500">
            Remaining 70% due 1 month before check-in
          </span>
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;