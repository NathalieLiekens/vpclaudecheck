import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Loading component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-villa-green mb-4"></div>
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-red-700 text-sm font-medium">Error</p>
        <p className="text-red-600 text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Success message component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-green-700 text-sm font-medium">Success</p>
        <p className="text-green-600 text-sm mt-1">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-green-400 hover:text-green-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [icalFile, setIcalFile] = useState(null);
  const [newRule, setNewRule] = useState({ 
    season: '', 
    startDate: '', 
    endDate: '', 
    multiplier: 1 
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingIcal, setIsUploadingIcal] = useState(false);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalRevenue: 0,
    averageStay: 0
  });

  // Fetch data function
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError('');

      const [bookingsResponse, rulesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/pricing-rules`)
      ]);

      setBookings(bookingsResponse.data);
      setPricingRules(rulesResponse.data);

      // Calculate statistics
      const now = new Date();
      const totalBookings = bookingsResponse.data.length;
      const upcomingBookings = bookingsResponse.data.filter(
        booking => new Date(booking.startDate) > now
      ).length;
      const totalRevenue = bookingsResponse.data.reduce(
        (sum, booking) => sum + (booking.total || 0), 0
      );
      const averageStay = totalBookings > 0 
        ? bookingsResponse.data.reduce((sum, booking) => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return sum + nights;
          }, 0) / totalBookings
        : 0;

      setStats({
        totalBookings,
        upcomingBookings,
        totalRevenue,
        averageStay: Math.round(averageStay * 10) / 10
      });

    } catch (err) {
      console.error('[ERROR] Fetching data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle iCal upload
  const handleIcalUpload = async (e) => {
    e.preventDefault();
    
    if (!icalFile) {
      setError('Please select an iCal file');
      return;
    }

    setIsUploadingIcal(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('ical', icalFile);
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/upload-ical`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('iCal uploaded successfully as fallback. Google Calendar remains the primary source.');
      setIcalFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('[ERROR] Uploading iCal:', err);
      setError('Failed to upload iCal file. Please try again.');
    } finally {
      setIsUploadingIcal(false);
    }
  };

  // Handle adding pricing rule
  const handleAddRule = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newRule.season.trim()) {
      setError('Season name is required');
      return;
    }
    if (!newRule.startDate || !newRule.endDate) {
      setError('Start and end dates are required');
      return;
    }
    if (new Date(newRule.startDate) >= new Date(newRule.endDate)) {
      setError('End date must be after start date');
      return;
    }
    if (newRule.multiplier <= 0) {
      setError('Multiplier must be greater than 0');
      return;
    }

    setIsAddingRule(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings/pricing-rules`, 
        newRule
      );
      
      setPricingRules(prev => [...prev, response.data]);
      setNewRule({ season: '', startDate: '', endDate: '', multiplier: 1 });
      setSuccess('Pricing rule added successfully');
      
    } catch (err) {
      console.error('[ERROR] Adding pricing rule:', err);
      setError('Failed to add pricing rule. Please try again.');
    } finally {
      setIsAddingRule(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  // Prepare calendar events
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.guestName} (${booking.adults + booking.kids} guests)`,
    start: new Date(booking.startDate),
    end: new Date(booking.endDate),
    resource: booking,
  }));

  // Custom event style
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#81C784',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Format currency
  const formatCurrency = (amount, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-villa-charcoal mb-6 text-center playfair-display">
          Admin Dashboard
        </h2>
        <LoadingSpinner message="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-villa-charcoal playfair-display">
          Admin Dashboard
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-villa-green text-white px-4 py-2 rounded-md hover:bg-villa-charcoal transition-colors disabled:bg-gray-400"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Message Display */}
      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-villa-green">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="text-2xl font-bold text-villa-charcoal">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Bookings</h3>
          <p className="text-2xl font-bold text-villa-charcoal">{stats.upcomingBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-villa-charcoal">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Average Stay</h3>
          <p className="text-2xl font-bold text-villa-charcoal">{stats.averageStay} nights</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4 text-villa-charcoal">Booking Calendar</h3>
        <div style={{ height: '500px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="month"
            popup
            onSelectEvent={(event) => {
              const booking = event.resource;
              alert(`Booking Details:\nGuest: ${booking.guestName}\nEmail: ${booking.email}\nGuests: ${booking.adults} adults, ${booking.kids} kids\nTotal: ${formatCurrency(booking.total, booking.currency)}`);
            }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4 text-villa-charcoal">Recent Bookings</h3>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold">Guest</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Dates</th>
                  <th className="text-left p-3 font-semibold">Guests</th>
                  <th className="text-left p-3 font-semibold">Total</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{booking.guestName}</td>
                    <td className="p-3">
                      <a href={`mailto:${booking.email}`} className="text-villa-green hover:underline">
                        {booking.email}
                      </a>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(booking.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-3">{booking.adults} adults, {booking.kids} kids</td>
                    <td className="p-3 font-semibold">{formatCurrency(booking.total, booking.currency)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(booking.startDate) > new Date()
                          ? 'bg-blue-100 text-blue-800'
                          : new Date(booking.endDate) < new Date()
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {new Date(booking.startDate) > new Date()
                          ? 'Upcoming'
                          : new Date(booking.endDate) < new Date()
                          ? 'Completed'
                          : 'Current'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length > 10 && (
              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm">Showing 10 of {bookings.length} bookings</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blocked Dates Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4 text-villa-charcoal">Manage Blocked Dates</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Primary Source:</strong> Blocked dates are managed via Google Calendar. 
            Update your calendar to add/remove blocks. Upload an iCal file below only if you need a backup source.
          </p>
        </div>
        
        <form onSubmit={handleIcalUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload iCal Backup File
            </label>
            <input
              type="file"
              accept=".ics"
              onChange={(e) => setIcalFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-villa-green file:text-white hover:file:bg-villa-charcoal"
              disabled={isUploadingIcal}
            />
          </div>
          <button 
            type="submit" 
            disabled={!icalFile || isUploadingIcal}
            className="bg-villa-charcoal text-white py-2 px-4 rounded-md hover:bg-villa-green transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isUploadingIcal && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isUploadingIcal ? 'Uploading...' : 'Upload iCal Backup'}</span>
          </button>
        </form>
      </div>

      {/* Dynamic Pricing Rules */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-villa-charcoal">Dynamic Pricing Rules</h3>
        
        {/* Existing Rules */}
        {pricingRules.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-villa-charcoal">Current Rules</h4>
            <div className="space-y-2">
              {pricingRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium">{rule.season}</span>
                    <span className="text-gray-500 ml-2">
                      ({new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()})
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-villa-green text-white rounded text-sm font-medium">
                    {rule.multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Rule Form */}
        <form onSubmit={handleAddRule} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season Name
              </label>
              <input
                type="text"
                value={newRule.season}
                onChange={(e) => setNewRule({ ...newRule, season: e.target.value })}
                placeholder="e.g., Peak Season"
                className="w-full border rounded p-2 text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isAddingRule}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={newRule.startDate}
                onChange={(e) => setNewRule({ ...newRule, startDate: e.target.value })}
                className="w-full border rounded p-2 text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isAddingRule}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={newRule.endDate}
                onChange={(e) => setNewRule({ ...newRule, endDate: e.target.value })}
                className="w-full border rounded p-2 text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isAddingRule}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Multiplier
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="10"
                value={newRule.multiplier}
                onChange={(e) => setNewRule({ ...newRule, multiplier: parseFloat(e.target.value) || 1 })}
                placeholder="1.25"
                className="w-full border rounded p-2 text-sm focus:ring-villa-green focus:border-villa-green"
                disabled={isAddingRule}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isAddingRule}
            className="bg-villa-green text-white py-2 px-4 rounded-md hover:bg-villa-charcoal transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAddingRule && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isAddingRule ? 'Adding Rule...' : 'Add Pricing Rule'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;