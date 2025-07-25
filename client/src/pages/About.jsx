import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal text-opacity-100 z-10 playfair-display">
        About Villa Pura
      </h1>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-villa-charcoal text-opacity-100 z-10">
          The Experience
        </h2>
        <div className="mb-12">
          <h3 className="text-lg sm:text-xl font-bold mb-4 mt-8 text-villa-charcoal text-opacity-100 z-10">
            Sleep in Style
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <img
              src="/wp-content/uploads/villa-pura/bed4.jpeg"
              alt="Bedrooms"
              className="w-full sm:w-1/2 h-96 sm:h-64 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <p className="text-base sm:text-lg text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
              Unwind in four exquisitely crafted bedrooms, each featuring plush King Koil beds, en-suite bathrooms, and air conditioning. Two ground-floor rooms open to the poolside oasis, while upstairs suites offer serene pool vistas and warm wooden floors accented with artistic murals. Each room includes a private nook for personal retreat.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 mt-8 text-villa-charcoal text-opacity-100 z-10">
            Connect and Unwind
          </h3>
          <div className="flex flex-col sm:flex-row-reverse items-center gap-6 mb-6">
            <img
              src="/wp-content/uploads/villa-pura/livingroom2.jpeg"
              alt="Common Area"
              className="w-full sm:w-1/2 h-96 sm:h-64 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <p className="text-base sm:text-lg text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
              The expansive common area, with soaring ceilings and expansive glass doors, invites connection and relaxation. A fully equipped kitchen sparks culinary inspiration, complemented by a dining space with poolside views. The lounge offers a cozy haven for tranquil evenings or vibrant gatherings, crafting unforgettable moments.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 mt-8 text-villa-charcoal text-opacity-100 z-10">
            Cozy Entertainment Hub
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <img
              src="/wp-content/uploads/villa-pura/tvroom.jpeg"
              alt="Entertainment Room"
              className="w-full sm:w-1/2 h-96 sm:h-64 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <p className="text-base sm:text-lg text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
              Escape to the upstairs entertainment room, a cozy retreat with a state-of-the-art TV. Perfect for family movie nights, quiet evenings, or immersive gaming, this space seamlessly blends relaxation and entertainment.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 mt-8 text-villa-charcoal text-opacity-100 z-10">
            Poolside Serenity
          </h3>
          <div className="flex flex-col sm:flex-row-reverse items-center gap-6 mb-6">
            <img
              src="/wp-content/uploads/villa-pura/poolsunlounges.jpeg"
              alt="Outdoor Oasis"
              className="w-full sm:w-1/2 h-96 sm:h-64 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <p className="text-base sm:text-lg text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
              Dive into an outdoor sanctuary featuring a pristine pool, sun loungers, a shaded seating area, and a poolside lounge. A traditional Balinese kubu enhances the ambiance, ideal for reading, sun-drenched relaxation, or intimate gatherings.
            </p>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          Getting Around
        </h2>
        <p className="text-base sm:text-lg mb-12 text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
          <strong>Parking</strong>: Complimentary private car and scooter parking available.<br />
          <strong>Location</strong>: Nestled in a serene retreat, just steps from Pererenan's chic cafes and trendy restaurants, offering a perfect blend of tranquility and convenience.
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          Amenities
        </h2>
        <ul className="list-disc ml-6 text-villa-charcoal text-opacity-100 z-10 space-y-2 text-base sm:text-lg mb-12">
          <li><strong>Bathroom</strong>: Luxe toiletries, shampoo, body wash, hot water, premium shower gel.</li>
          <li><strong>Bedroom & Laundry</strong>: Plush towels, crisp bed linens, soap, toilet paper, ample storage.</li>
          <li><strong>Entertainment</strong>: High-definition TV.</li>
          <li><strong>Heating & Cooling</strong>: Air conditioning, ceiling fans.</li>
          <li><strong>Internet & Office</strong>: High-speed Wi-Fi, dedicated workspace.</li>
          <li><strong>Kitchen & Dining</strong>: Fully equipped gourmet kitchen, refrigerator, freezer, stove, oven, coffee maker, elegant wine glasses, dining table, complete cooking essentials.</li>
          <li><strong>Parking & Facilities</strong>: Free parking, private pool.</li>
          <li><strong>Services</strong>: Long-term stays (28+ days), daily housekeeping.</li>
        </ul>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          House Rules & Bali Experience
        </h2>
        <ul className="list-disc ml-6 text-villa-charcoal text-opacity-100 z-10 space-y-2 text-base sm:text-lg">
          <li><strong>Check-in</strong>: Flexible from 2:00 PM to 10:00 PM (arrangements possible outside hours).</li>
          <li><strong>Checkout</strong>: Please depart by 11:00 AM (early checkout may be arranged).</li>
          <li><strong>Guests</strong>: Welcomes up to 8 guests.</li>
          <li><strong>Pets</strong>: Not permitted to ensure a comfortable stay for all.</li>
          <li><strong>Parties/Events</strong>: Not allowed; please respect the tranquil ambiance.</li>
          <li><strong>Damages</strong>: Smoking permitted in outdoor areas only. Guests are responsible for any damage or loss.</li>
          <li><strong>Bali's Natural Charm</strong>: You're booking a stay on Bali, a tropical island teeming with life. Expect occasional natural scents from plants, rain, or the sea breeze—part of the authentic experience! These, along with sounds like nearby ceremonies, roosters, or wildlife (frogs, geckos, birds), are normal and enhance Bali's vibrant spirit. They aren't grounds for refunds or cancellations.</li>
          <li><strong>Tropical Living</strong>: In this lush climate, occasional visits from insects (like ants or mosquitoes) may occur despite our professional pest control. Heavy rain, humidity, or wind might briefly affect outdoor spaces, and utility interruptions (internet, electricity, water) can happen due to local infrastructure. These are natural elements of Bali life, not property issues, and don't qualify for refunds.</li>
          <li><strong>Neighboring Vibes</strong>: We can't control neighbor activities, but our team is here to assist if needed.</li>
        </ul>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          Exclusive Concierge Services
        </h2>
        <p className="text-base sm:text-lg mb-12 text-villa-charcoal text-opacity-100 z-10 leading-relaxed">
          Enhance your stay with our dedicated Guest Relations Manager, available upon request. From arranging tours and transportation to booking massages, activities, or reservations, our team is committed to crafting a memorable, hassle-free vacation. Your journey begins with a warm welcome from us!
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          Included in Every Stay
        </h2>
        <ul className="list-disc ml-6 text-villa-charcoal text-opacity-100 z-10 space-y-2 text-base sm:text-lg mb-12">
          <li>Welcome drink to start your adventure.</li>
          <li>Attentive villa staff with daily cleaning.</li>
          <li>Bath towels for each guest.</li>
          <li>High-speed Wi-Fi internet connection.</li>
          <li>Secure safety boxes for your peace of mind.</li>
          <li>Personalized Concierge Services.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center text-villa-charcoal text-opacity-100 z-10">
          Our Location
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-villa-charcoal mb-2">Villa Pura Bali</h3>
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

export default About;