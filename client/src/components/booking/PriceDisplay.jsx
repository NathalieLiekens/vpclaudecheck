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

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      {discountApplied && discountCode !== 'TESTFREE' && (
        <p className="text-lg text-villa-charcoal">
          <span className="line-through text-gray-500">
            Original: {currency} {parseInt(total).toLocaleString('id-ID')}
          </span>
        </p>
      )}
      
      <p className="text-xl text-villa-charcoal font-semibold">
        {discountApplied && discountCode !== 'TESTFREE' ? 'Discounted Total' : 'Total'}: 
        <span className="text-villa-green ml-2">
          {currency} {parseInt(discountedTotal).toLocaleString('id-ID')}
        </span>
      </p>
      
      <p className="text-sm text-gray-600">
        for {nights} night{nights !== 1 ? 's' : ''}
      </p>
      
      {discountApplied && discountCode === 'MEGAN' && (
        <p className="text-sm text-villa-green">✓ 5% discount applied</p>
      )}
      
      {discountApplied && discountCode === 'TESTFREE' && (
        <p className="text-sm text-villa-green">✓ Free booking</p>
      )}
      
      {paymentType === 'deposit' && discountCode !== 'TESTFREE' && (
        <p className="text-sm text-blue-600">
          30% deposit: {currency} {Math.round(discountedTotal * 0.3).toLocaleString('id-ID')}
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