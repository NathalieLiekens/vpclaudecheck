import React, { useState, useEffect } from 'react';

const PersonalInfoSection = ({
  firstName,
  lastName,
  email,
  arrivalTime,
  specialRequests,
  setFirstName,
  setLastName,
  setEmail,
  setArrivalTime,
  setSpecialRequests,
  validateEmail,
  validateName
}) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  useEffect(() => {
    const errors = {};
    
    if (touched.firstName && !validateName(firstName)) {
      errors.firstName = 'First name must be at least 2 characters and contain only letters';
    }
    
    if (touched.lastName && !validateName(lastName)) {
      errors.lastName = 'Last name must be at least 2 characters and contain only letters';
    }
    
    if (touched.email && !validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFieldErrors(errors);
  }, [firstName, lastName, email, touched, validateEmail, validateName]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getInputClassName = (field, baseClass) => {
    const hasError = fieldErrors[field];
    const isValid = touched[field] && !hasError && 
      ((field === 'firstName' && validateName(firstName)) ||
       (field === 'lastName' && validateName(lastName)) ||
       (field === 'email' && validateEmail(email)));
    
    let classes = baseClass;
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (isValid) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    } else {
      classes += ' focus:ring-villa-green focus:border-villa-green';
    }
    
    return classes;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-villa-charcoal mb-4">Guest Information</h3>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            First Name *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Enter your first name"
            className={getInputClassName('firstName', 'w-full border rounded p-2 text-villa-charcoal text-sm')}
            required
            maxLength={50}
            autoComplete="given-name"
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
          )}
          {touched.firstName && !fieldErrors.firstName && validateName(firstName) && (
            <p className="text-green-500 text-xs mt-1">✓ Valid</p>
          )}
        </div>
        
        <div className="flex-1">
          <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
            Last Name *
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="Enter your last name"
            className={getInputClassName('lastName', 'w-full border rounded p-2 text-villa-charcoal text-sm')}
            required
            maxLength={50}
            autoComplete="family-name"
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
          )}
          {touched.lastName && !fieldErrors.lastName && validateName(lastName) && (
            <p className="text-green-500 text-xs mt-1">✓ Valid</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
          Email Address *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="Enter your email address"
          className={getInputClassName('email', 'w-full border rounded p-2 text-villa-charcoal text-sm')}
          required
          maxLength={100}
          autoComplete="email"
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
        )}
        {touched.email && !fieldErrors.email && validateEmail(email) && (
          <p className="text-green-500 text-xs mt-1">✓ Valid email address</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          We'll send your booking confirmation to this email
        </p>
      </div>
      
      <div>
        <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
          Approximate Arrival Time
        </label>
        <select
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
        >
          <option value="14:00">2:00 PM (Standard check-in)</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="17:00">5:00 PM</option>
          <option value="18:00">6:00 PM</option>
          <option value="19:00">7:00 PM</option>
          <option value="20:00">8:00 PM</option>
          <option value="21:00">9:00 PM</option>
          <option value="22:00">10:00 PM (Latest check-in)</option>
          <option value="custom">Other (please specify in special requests)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Check-in is available from 2:00 PM to 10:00 PM
        </p>
      </div>
      
      <div>
        <label className="block mb-1 text-villa-charcoal font-semibold text-sm">
          Special Requests (Optional)
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Let us know about any special arrangements you'd like us to help with:
        </p>
        <div className="mb-2">
          <p className="text-xs text-gray-400">Popular requests:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              'Late checkout', 
              'Airport transfer', 
              'In-villa massage', 
              'Daily breakfast', 
              'Grocery shopping',
              'Scooter rental',
              'Birthday celebration'
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  const current = specialRequests.toLowerCase();
                  const suggestionLower = suggestion.toLowerCase();
                  if (!current.includes(suggestionLower)) {
                    const newRequests = specialRequests 
                      ? `${specialRequests}, ${suggestion}`
                      : suggestion;
                    setSpecialRequests(newRequests);
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-villa-green hover:text-white px-2 py-1 rounded transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or arrangements? (e.g., early check-in, late checkout, airport transfers, in-villa services, dietary requirements, celebration arrangements)"
          className="w-full border rounded p-2 text-villa-charcoal text-sm focus:ring-villa-green focus:border-villa-green"
          rows="4"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {specialRequests.length}/500 characters
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Our concierge team can arrange transportation, activities, 
          massages, and dining reservations. Just let us know what you're interested in!
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoSection;