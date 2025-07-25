import React from 'react';

const GuestSelectionSection = ({
  adults,
  kids,
  setAdults,
  setKids,
  onError
}) => {
  const handleAdultsChange = (newAdults) => {
    const adultsCount = Math.max(0, parseInt(newAdults) || 0);
    if (adultsCount + kids <= 8) {
      setAdults(adultsCount);
      onError('');
    } else {
      onError('Maximum 8 guests (adults + kids).');
    }
  };

  const handleKidsChange = (newKids) => {
    const kidsCount = Math.max(0, parseInt(newKids) || 0);
    if (adults + kidsCount <= 8) {
      setKids(kidsCount);
      onError('');
    } else {
      onError('Maximum 8 guests (adults + kids).');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            Adults
          </label>
          <input
            type="number"
            value={adults}
            onChange={(e) => handleAdultsChange(e.target.value)}
            min="1"
            max={8 - kids}
            className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            Kids
          </label>
          <input
            type="number"
            value={kids}
            onChange={(e) => handleKidsChange(e.target.value)}
            min="0"
            max={8 - adults}
            className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestSelectionSection;