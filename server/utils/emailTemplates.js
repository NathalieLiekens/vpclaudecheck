const getGuestEmailTemplate = ({ booking, checkInFormatted, checkOutFormatted, finalPaymentDue, bookingIdFormatted }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <header style="text-align: center; padding-bottom: 20px;">
      <img src="https://nathbyte.com/logo.png" style="width: 100px; border-radius: 50%; display: block; margin: 0 auto;" alt="Villa Pura Logo">
      <h1 style="text-align: center; color: #0066cc; font-size: 24px; margin: 10px 0;">VILLA PURA BALI</h1>
      <h2 style="text-align: center; color: #333; font-size: 20px; margin: 5px 0;">Your Tropical Paradise Awaits</h2>
    </header>
    <main>
      <p style="font-size: 16px; line-height: 1.5;">Dear ${booking.guestName},</p>
      <p style="font-size: 16px; line-height: 1.5;">We’re delighted to welcome you to Villa Pura Bali for your upcoming tropical escape! Your reservation is confirmed.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">✓ BOOKING CONFIRMED</h3>
      <p style="font-size: 16px; line-height: 1.5;">Below are your booking details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #fff; border-radius: 4px;">
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Booking Reference</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${bookingIdFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Guest Name</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.guestName}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-in Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-out Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Duration</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${(booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)} nights</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Daily Rate</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${(booking.total / ((booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24))).toLocaleString('id-ID')}</td>
        </tr>
        ${booking.discountCode === 'MEGAN' ? `
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Discount</th>
          <td style="padding: 8px; border: 1px solid #ddd;">5% (MEGAN)</td>
        </tr>
        ` : booking.discountCode === 'TESTFREE' ? `
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Discount</th>
          <td style="padding: 8px; border: 1px solid #ddd;">100% (TESTFREE)</td>
        </tr>
        ` : ''}
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Total Amount</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.total.toLocaleString('id-ID')}</td>
        </tr>
      </table>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">💰 Payment Confirmation</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #fff; border-radius: 4px;">
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Deposit Received</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.amountPaid.toLocaleString('id-ID')}</td>
        </tr>
        ${booking.paymentType === 'deposit' && booking.discountCode !== 'TESTFREE' ? `
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Outstanding Balance</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.remainingAmount.toLocaleString('id-ID')}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Final Payment Due</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${finalPaymentDue}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px; border: 1px solid #ddd; font-size: 14px; line-height: 1.5;">
            An invoice for the remaining balance will be sent to you in due time. If you prefer to pay via bank transfer, please contact us at <a href="mailto:bookings@nathbyte.com" style="color: #0066cc; text-decoration: none;">bookings@nathbyte.com</a> for details.
          </td>
        </tr>
        ` : ''}
      </table>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">🏖️ Check-in & Check-out Information</h3>
      <p style="font-size: 16px; line-height: 1.5;">
        <strong>Check-in:</strong> From 2:00 PM onwards<br>
        <strong>Check-out:</strong> By 11:00 AM
      </p>
      <p style="font-size: 16px; line-height: 1.5;">Upon arrival, our villa manager will greet you at the property to assist with check-in and provide a tour of the facilities.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">🚗 Additional Services</h3>
      <p style="font-size: 16px; line-height: 1.5;">${booking.airportTransfer ? 'Free airport transfer included! ' : ''}Need assistance with ${booking.airportTransfer ? 'other ' : ''}arrangements? Reply to this email.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">📋 Cancellation Policy</h3>
      <p style="font-size: 16px; line-height: 1.5;">Cancellations made before ${finalPaymentDue} are eligible for a full refund of the deposit, minus a 4% administration fee.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">We're Here to Help! 🌺</h3>
      <p style="font-size: 16px; line-height: 1.5;">Contact us for:</p>
      <ul style="font-size: 16px; line-height: 1.5; margin: 10px 0; padding-left: 20px;">
        <li>Airport transfers and transportation</li>
        <li>Local recommendations and activities</li>
        <li>Special arrangements or requests</li>
        <li>Any questions about your stay</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.5;">
        <strong>WhatsApp:</strong> <a href="https://wa.me/6281339007297" style="color: #0066cc; text-decoration: none;">+62 813-3900-7297</a>
      </p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">📍 Villa Location</h3>
      <p style="font-size: 16px; line-height: 1.5;">
        Jl. Pantai Pererenan Gang Mangga, Pererenan<br>
        Kec. Mengwi, Kabupaten Badung, Bali 80351
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        <a href="https://maps.google.com/?q=Jl.+Pantai+Pererenan+Gang+Mangga,+Pererenan,+Kec.+Mengwi,+Kabupaten+Badung,+Bali+80351" style="color: #0066cc; text-decoration: none;">🗺️ Open in Google Maps</a>
      </p>
    </main>
    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
      <p style="font-size: 14px; color: #666; line-height: 1.5;">Thank you for choosing Villa Pura Bali.</p>
      <p style="font-size: 12px; color: #666;">
        <a href="https://nathbyte.com" style="color: #0066cc; text-decoration: none;">nathbyte.com</a> | 
        <a href="https://nathbyte.com/privacy" style="color: #0066cc; text-decoration: none;">Privacy Policy</a> | 
        <a href="https://nathbyte.com/terms-and-conditions" style="color: #0066cc; text-decoration: none;">Terms & Conditions</a>
      </p>
    </footer>
    <style>
      @media only screen and (max-width: 600px) {
        table { font-size: 12px; }
        h1 { font-size: 20px; }
        h2 { font-size: 18px; }
        h3 { font-size: 16px; }
        p { font-size: 14px; }
        ul { font-size: 14px; }
        img { width: 80px; }
      }
    </style>
  </div>
`;

const getOwnerEmailTemplate = ({ booking, checkInFormatted, checkOutFormatted, finalPaymentDue, bookingIdFormatted }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <h2 style="text-align: center; color: #0066cc; font-size: 20px;">New Booking Notification</h2>
    <p style="font-size: 16px;">A new booking has been made for Villa Pura Bali.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Booking Reference</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${bookingIdFormatted}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Guest Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.guestName}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Check-in Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkInFormatted} at 2:00 PM</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Check-out Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Duration</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${(booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)} nights</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Amount</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.total.toLocaleString('id-ID')}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Amount Paid</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.amountPaid.toLocaleString('id-ID')} (${booking.paymentType === 'deposit' && booking.discountCode !== 'TESTFREE' ? '30% deposit' : 'Full payment'})</td>
      </tr>
      ${booking.paymentType === 'deposit' && booking.discountCode !== 'TESTFREE' ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Remaining Amount</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.remainingAmount.toLocaleString('id-ID')} (due ${finalPaymentDue})</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Airport Transfer</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.airportTransfer ? 'Included' : 'Not included'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Arrival Time</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.arrivalTime || '2:00 PM'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Special Requests</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.specialRequests || 'None'}</td>
      </tr>
      ${booking.discountCode ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Discount Code</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${booking.discountCode}</td>
      </tr>
      ` : ''}
    </table>
    <p style="font-size: 16px;">Please prepare for the guest's arrival.</p>
    <p style="font-size: 16px; text-align: center;">
      <a href="https://nathbyte.com/contact" style="color: #0066cc; text-decoration: none;">Contact Guest</a>
    </p>
    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">Villa Pura Bali, operated by PT. Acron Teknik, Indonesia.</p>
    <style>
      @media only screen and (max-width: 600px) {
        table { font-size: 12px; }
        h2 { font-size: 18px; }
        p { font-size: 14px; }
      }
    </style>
  </div>
`;

const getSecondPaymentReminderTemplate = ({ booking, checkInFormatted, finalPaymentDue, bookingIdFormatted, daysBeforeDue }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <header style="text-align: center; padding-bottom: 20px;">
      <img src="https://nathbyte.com/logo.png" style="width: 100px; border-radius: 50%; display: block; margin: 0 auto;" alt="Villa Pura Logo">
      <h1 style="text-align: center; color: #0066cc; font-size: 24px; margin: 10px 0;">VILLA PURA BALI</h1>
    </header>
    <main>
      <p style="font-size: 16px; line-height: 1.5;">Dear ${booking.guestName},</p>
      <p style="font-size: 16px; line-height: 1.5;">This is a friendly reminder that the remaining balance for your booking at Villa Pura Bali is due in ${daysBeforeDue} days.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #fff; border-radius: 4px;">
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Booking Reference</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${bookingIdFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-in Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Outstanding Balance</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.remainingAmount.toLocaleString('id-ID')}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Due Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${finalPaymentDue}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px; border: 1px solid #ddd; font-size: 14px; line-height: 1.5;">
            An invoice for the remaining balance will be sent to you in due time. If you prefer to pay via bank transfer, please contact us at <a href="mailto:bookings@nathbyte.com" style="color: #0066cc; text-decoration: none;">bookings@nathbyte.com</a> for details.
          </td>
        </tr>
      </table>
      <p style="font-size: 16px; line-height: 1.5;">We look forward to welcoming you!</p>
    </main>
    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
      <p style="font-size: 12px; color: #666;">
        <a href="https://nathbyte.com" style="color: #0066cc; text-decoration: none;">nathbyte.com</a>
      </p>
    </footer>
  </div>
`;

const getSecondPaymentConfirmationTemplate = ({ booking, checkInFormatted, bookingIdFormatted }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <header style="text-align: center; padding-bottom: 20px;">
      <img src="https://nathbyte.com/logo.png" style="width: 100px; border-radius: 50%; display: block; margin: 0 auto;" alt="Villa Pura Logo">
      <h1 style="text-align: center; color: #0066cc; font-size: 24px; margin: 10px 0;">VILLA PURA BALI</h1>
    </header>
    <main>
      <p style="font-size: 16px; line-height: 1.5;">Dear ${booking.guestName},</p>
      <p style="font-size: 16px; line-height: 1.5;">Thank you for your final payment for your booking at Villa Pura Bali. Your payment has been received, and your booking is fully confirmed.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #fff; border-radius: 4px;">
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Booking Reference</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${bookingIdFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-in Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Total Paid</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.currency} ${booking.total.toLocaleString('id-ID')}</td>
        </tr>
      </table>
      <p style="font-size: 16px; line-height: 1.5;">We look forward to welcoming you to Villa Pura Bali!</p>
    </main>
    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
      <p style="font-size: 12px; color: #666;">
        <a href="https://nathbyte.com" style="color: #0066cc; text-decoration: none;">nathbyte.com</a>
      </p>
    </footer>
  </div>
`;

const getPreArrivalEmailTemplate = ({ booking, checkInFormatted, checkOutFormatted, bookingIdFormatted }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <header style="text-align: center; padding-bottom: 20px;">
      <img src="https://nathbyte.com/logo.png" style="width: 100px; border-radius: 50%; display: block; margin: 0 auto;" alt="Villa Pura Logo">
      <h1 style="text-align: center; color: #0066cc; font-size: 24px; margin: 10px 0;">VILLA PURA BALI</h1>
    </header>
    <main>
      <p style="font-size: 16px; line-height: 1.5;">Dear ${booking.guestName},</p>
      <p style="font-size: 16px; line-height: 1.5;">Your stay at Villa Pura Bali is just around the corner! We're excited to welcome you.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #fff; border-radius: 4px;">
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Booking Reference</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${bookingIdFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-in Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkInFormatted} at 2:00 PM</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Check-out Date</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Arrival Time</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.arrivalTime || '2:00 PM'}</td>
        </tr>
        <tr style="background-color: #e6f0fa;">
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Special Requests</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.specialRequests || 'None'}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Airport Transfer</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.airportTransfer ? 'Included' : 'Not included'}</td>
        </tr>
      </table>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">Preparing for Your Stay</h3>
      <p style="font-size: 16px; line-height: 1.5;">Please confirm your arrival time by replying to this email or contacting us at <a href="https://wa.me/6281339007297" style="color: #0066cc; text-decoration: none;">+62 813-3900-7297</a>.</p>
      <p style="font-size: 16px; line-height: 1.5;">Additional services (e.g., in-villa massages, daily breakfast) can be arranged upon request.</p>
      <h3 style="color: #0066cc; font-size: 18px; margin: 20px 0;">📍 Villa Location</h3>
      <p style="font-size: 16px; line-height: 1.5;">
        Jl. Pantai Pererenan Gang Mangga, Pererenan<br>
        Kec. Mengwi, Kabupaten Badung, Bali 80351
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        <a href="https://maps.google.com/?q=Jl.+Pantai+Pererenan+Gang+Mangga,+Pererenan,+Kec.+Mengwi,+Kabupaten+Badung,+Bali+80351" style="color: #0066cc; text-decoration: none;">🗺️ Open in Google Maps</a>
      </p>
    </main>
    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
      <p style="font-size: 12px; color: #666;">
        <a href="https://nathbyte.com" style="color: #0066cc; text-decoration: none;">nathbyte.com</a>
      </p>
    </footer>
  </div>
`;

module.exports = {
  getGuestEmailTemplate,
  getOwnerEmailTemplate,
  getSecondPaymentReminderTemplate,
  getSecondPaymentConfirmationTemplate,
  getPreArrivalEmailTemplate,
};