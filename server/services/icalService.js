const ical = require('node-ical');
const { DateTime } = require('luxon');
const ics = require('ics'); // For generating iCal files

const getBlockedDates = async () => {
  try {
    const icalUrl = process.env.ICAL_URL;
    if (!icalUrl) throw new Error('ICAL_URL not set');
    const icalData = await ical.async.fromURL(icalUrl);
    const blockedDates = [];

    for (const event of Object.values(icalData)) {
      if (event.type === 'VEVENT') {
        const start = DateTime.fromJSDate(new Date(event.start), { zone: 'Asia/Makassar' }).startOf('day');
        const end = DateTime.fromJSDate(new Date(event.end), { zone: 'Asia/Makassar' }).startOf('day');
        blockedDates.push({
          start: start.toJSDate(),
          end: end.toJSDate(),
        });
      }
    }
    console.log('[INFO] Blocked dates fetched:', blockedDates.map(d => ({
      start: new Date(d.start).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' }),
      end: new Date(d.end).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' }),
    })));
    return blockedDates;
  } catch (error) {
    console.error('[ERROR] Failed to fetch iCal:', error.message);
    throw error;
  }
};

const checkDateAvailability = (checkInDate, checkOutDate, blockedDates) => {
  for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
    const isBlocked = blockedDates.some(
      blocked => d >= new Date(blocked.start) && d < new Date(blocked.end)
    );
    if (isBlocked) {
      throw new Error(`Date ${d.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar' })} is not available`);
    }
  }
};

const generateICalEvent = (booking) => {
  try {
    const bookingIdFormatted = `VPB-${booking.checkInDate.getFullYear()}${(booking.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${booking.checkInDate.getDate().toString().padStart(2, '0')}`;
    const event = {
      start: [
        booking.checkInDate.getFullYear(),
        booking.checkInDate.getMonth() + 1,
        booking.checkInDate.getDate(),
      ],
      end: [
        booking.checkOutDate.getFullYear(),
        booking.checkOutDate.getMonth() + 1,
        booking.checkOutDate.getDate(),
      ],
      title: `Booking: ${booking.guestName} (${bookingIdFormatted})`,
      description: `Guest: ${booking.guestName}\nEmail: ${booking.email}\nBooking ID: ${bookingIdFormatted}`,
      location: 'Jl. Pantai Pererenan Gang Mangga, Pererenan, Kec. Mengwi, Kabupaten Badung, Bali 80351',
    };

    const { error, value } = ics.createEvent(event);
    if (error) {
      throw new Error(`Failed to generate iCal event: ${error.message}`);
    }
    console.log('[INFO] iCal event generated for booking:', booking._id);
    return value; // Returns iCal string for manual import
  } catch (error) {
    console.error('[ERROR] Failed to generate iCal event:', error.message);
    throw error;
  }
};

module.exports = { getBlockedDates, checkDateAvailability, generateICalEvent };