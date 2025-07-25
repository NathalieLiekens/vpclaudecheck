const Contact = () => {
  return (
    <div className="container mx-auto py-16 px-4 bg-villa-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-villa-charcoal">
        We'd Love to Hear From You
      </h1>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg mb-6 text-villa-charcoal leading-relaxed">
          Have questions or need assistance? Our friendly team is here to help! Reach us at{" "}
          <a
            href="mailto:info@villapurabali.com"
            className="text-villa-green hover:underline"
          >
            info@villapurabali.com
          </a>{" "}
          for bookings, inquiries, or personalized advice about your stay at Villa Pura Bali. We're excited to make your experience unforgettable!
        </p>
        
        <p className="text-base sm:text-lg mt-4 text-villa-charcoal text-center">
          Prefer a quicker response? Follow us on{" "}
          <a href="https://www.instagram.com/villapurabali" className="text-villa-green hover:underline">
            Instagram
          </a>, or chat with us directly via WhatsApp at{" "}
          <a href="https://wa.me/6281339007297" className="text-villa-green hover:underline">
            +62 813-3900-7297
          </a>.
        </p>
      </div>

      {/* Location Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-villa-charcoal">
          Visit Us
        </h2>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-villa-charcoal mb-2">Villa Pura Bali</h3>
            <p className="text-base text-villa-charcoal mb-4">
              Jl. Pantai Pererenan Gang Mangga<br />
              Pererenan, Kec. Mengwi<br />
              Kabupaten Badung, Bali 80351<br />
              Indonesia
            </p>
            <p className="text-sm text-villa-charcoal">
              <a href="https://maps.google.com/?q=Jl.+Pantai+Pererenan+Gang+Mangga,+Pererenan,+Kec.+Mengwi,+Kabupaten+Badung,+Bali+80351" 
                 className="text-villa-green hover:underline inline-flex items-center gap-1"
                 target="_blank" 
                 rel="noopener noreferrer">
                🗺️ Open in Google Maps
              </a>
            </p>
          </div>
          
          {/* Embedded Google Map */}
          <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2789623456!2d115.13719731478!3d-8.6424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzgnMzIuNiJTIDExNcKwMDgnMjIuMyJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Villa Pura Bali Location"
            ></iframe>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-villa-charcoal mb-2">🏖️ Distance to Beach</h4>
              <p className="text-sm text-gray-600">Pererenan Beach: 3 minutes drive</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-villa-charcoal mb-2">🍽️ Nearby Dining</h4>
              <p className="text-sm text-gray-600">Hula Cafe: 50 meters walk</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Located in the heart of Pererenan, just minutes from the beach and local attractions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;