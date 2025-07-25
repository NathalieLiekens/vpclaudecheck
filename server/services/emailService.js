const { Resend } = require('resend');
const {
  getGuestEmailTemplate,
  getOwnerEmailTemplate,
  getSecondPaymentReminderTemplate,
  getSecondPaymentConfirmationTemplate,
  getPreArrivalEmailTemplate,
} = require('../utils/emailTemplates');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendConfirmationEmails = async (booking) => {
  try {
    const checkInFormatted = booking.checkInDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const checkOutFormatted = booking.checkOutDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const finalPaymentDue = new Date(booking.checkInDate.getTime() - 28 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const bookingIdFormatted = `VPB-${booking.checkInDate.getFullYear()}${(booking.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${booking.checkInDate.getDate().toString().padStart(2, '0')}`;

    const guestEmailHtml = getGuestEmailTemplate({
      booking,
      checkInFormatted,
      checkOutFormatted,
      finalPaymentDue,
      bookingIdFormatted,
    });
    await resend.emails.send({
      from: 'Villa Pura Bali <bookings@villapurabali.com>',
      to: booking.email,
      subject: 'Villa Pura Bali - Your Booking Confirmation',
      html: guestEmailHtml,
    });
    console.log('[INFO] Guest email sent to:', booking.email);

    if (process.env.OWNER_EMAIL) {
      const ownerEmailHtml = getOwnerEmailTemplate({
        booking,
        checkInFormatted,
        checkOutFormatted,
        finalPaymentDue,
        bookingIdFormatted,
      });
      await resend.emails.send({
        from: 'Villa Pura Bali <bookings@villapurabali.com>',
        to: process.env.OWNER_EMAIL,
        subject: 'New Booking Notification - Villa Pura Bali',
        html: ownerEmailHtml,
      });
      console.log('[INFO] Owner email sent to:', process.env.OWNER_EMAIL);
    } else {
      console.error('[ERROR] OWNER_EMAIL not configured');
      throw new Error('Owner email address not configured');
    }
  } catch (error) {
    console.error('[ERROR] Failed to send confirmation emails:', error.message);
    throw error;
  }
};

const sendSecondPaymentReminder = async (booking, daysBeforeDue) => {
  try {
    const checkInFormatted = booking.checkInDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const finalPaymentDue = new Date(booking.checkInDate.getTime() - 28 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const bookingIdFormatted = `VPB-${booking.checkInDate.getFullYear()}${(booking.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${booking.checkInDate.getDate().toString().padStart(2, '0')}`;

    const emailHtml = getSecondPaymentReminderTemplate({
      booking,
      checkInFormatted,
      finalPaymentDue,
      bookingIdFormatted,
      daysBeforeDue,
    });
    await resend.emails.send({
      from: 'Villa Pura Bali <bookings@villapurabali.com>',
      to: booking.email,
      subject: `Villa Pura Bali - Final Payment Reminder (${daysBeforeDue} Days)`,
      html: emailHtml,
    });
    console.log(`[INFO] Second payment reminder (${daysBeforeDue} days) sent to:`, booking.email);
  } catch (error) {
    console.error('[ERROR] Failed to send second payment reminder:', error.message);
    throw error;
  }
};

const sendSecondPaymentConfirmation = async (booking) => {
  try {
    const checkInFormatted = booking.checkInDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const bookingIdFormatted = `VPB-${booking.checkInDate.getFullYear()}${(booking.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${booking.checkInDate.getDate().toString().padStart(2, '0')}`;

    const emailHtml = getSecondPaymentConfirmationTemplate({
      booking,
      checkInFormatted,
      bookingIdFormatted,
    });
    await resend.emails.send({
      from: 'Villa Pura Bali <bookings@villapurabali.com>',
      to: booking.email,
      subject: 'Villa Pura Bali - Final Payment Confirmation',
      html: emailHtml,
    });
    console.log('[INFO] Second payment confirmation sent to:', booking.email);
  } catch (error) {
    console.error('[ERROR] Failed to send second payment confirmation:', error.message);
    throw error;
  }
};

const sendPreArrivalEmail = async (booking) => {
  try {
    const checkInFormatted = booking.checkInDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const checkOutFormatted = booking.checkOutDate.toLocaleDateString('en-ID', { timeZone: 'Asia/Makassar', month: 'long', day: 'numeric', year: 'numeric' });
    const bookingIdFormatted = `VPB-${booking.checkInDate.getFullYear()}${(booking.checkInDate.getMonth() + 1).toString().padStart(2, '0')}${booking.checkInDate.getDate().toString().padStart(2, '0')}`;

    const emailHtml = getPreArrivalEmailTemplate({
      booking,
      checkInFormatted,
      checkOutFormatted,
      bookingIdFormatted,
    });
    await resend.emails.send({
      from: 'Villa Pura Bali <bookings@villapurabali.com>',
      to: booking.email,
      subject: 'Villa Pura Bali - Prepare for Your Stay',
      html: emailHtml,
    });
    console.log('[INFO] Pre-arrival email sent to:', booking.email);
  } catch (error) {
    console.error('[ERROR] Failed to send pre-arrival email:', error.message);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmails,
  sendSecondPaymentReminder,
  sendSecondPaymentConfirmation,
  sendPreArrivalEmail,
};