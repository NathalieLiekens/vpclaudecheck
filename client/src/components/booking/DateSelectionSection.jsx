import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelectionSection = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  blockedDates,
  loading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            Check-in Date
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={onCheckInChange}
            minDate={new Date()}
            maxDate={new Date(2027, 0, 31)}
            excludeDates={blockedDates}
            className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
            placeholderText="Select check-in date"
            dateFormat="dd/MM/yyyy"
            disabled={loading}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            Check-out Date
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={onCheckOutChange}
            minDate={checkInDate ? new Date(checkInDate.getTime() + (checkInDate >= new Date(2025, 0, 1) && checkInDate < new Date(2025, 0, 6) || checkInDate >= new Date(2025, 11, 20) ? 5 : 2) * 24 * 60 * 60 * 1000) : new Date()}
            maxDate={new Date(2027, 0, 31)}
            excludeDates={blockedDates}
            className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
            placeholderText="Select check-out date"
            dateFormat="dd/MM/yyyy"
            disabled={loading}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelectionSection;