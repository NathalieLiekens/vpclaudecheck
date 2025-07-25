import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-villa-white">
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(/wp-content/uploads/villa-pura/hero.jpg)` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto text-center text-villa-white relative z-10 px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] playfair-display">
            Villa Pura Bali
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Your Stunning 4-Bedroom Retreat in the Heart of Bali
          </p>
          <Link
            to="/booking"
            className="inline-block bg-villa-green text-villa-white py-3 px-8 rounded-md hover:bg-villa-charcoal-dark transition-colors duration-300 drop-shadow-xl"
          >
            Book Now
          </Link>
        </div>
      </section>
      
      <section className="container mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
          Welcome to Villa Pura
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <img
            src="/wp-content/uploads/villa-pura/outsidearea.jpeg"
            alt="Pool area"
            className="w-full sm:w-1/2 h-64 sm:h-96 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <p className="text-lg sm:text-xl text-villa-charcoal leading-relaxed">
            Nestled in Pererenan's vibrant core, Villa Pura offers a luxurious 4-bedroom haven, blending sleek modern design with airy elegance, just moments from Bali's sun-drenched beaches.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
          Why Villa Pura?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="font-bold text-villa-charcoal mb-3 text-xl sm:text-2xl playfair-display">
              Poolside Paradise
            </h3>
            <p className="text-villa-charcoal text-base sm:text-lg">
              Dive into a stunning 14-meter private pool, a Pererenan gem.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="font-bold text-villa-charcoal mb-3 text-xl sm:text-2xl playfair-display">
              Effortless Comfort
            </h3>
            <p className="text-villa-charcoal text-base sm:text-lg">
              Spacious interiors designed for seamless relaxation, loved by guests.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="font-bold text-villa-charcoal mb-3 text-xl sm:text-2xl playfair-display">
              Temple Serenity
            </h3>
            <p className="text-villa-charcoal text-base sm:text-lg">
              Enjoy tranquil views of a sacred Balinese temple, a unique cultural gem.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/reviews"
            className="text-villa-green hover:underline text-base sm:text-lg link-visible"
          >
            See what guests say
          </Link>
        </div>
      </section>
      
      <section className="container mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
          Your Tropical Retreat
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row-reverse items-center gap-8">
          <img
            src="/wp-content/uploads/villa-pura/diningnight1.jpeg"
            alt="Dining area at night"
            className="w-full sm:w-1/2 h-64 sm:h-96 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <p className="text-lg sm:text-xl text-villa-charcoal leading-relaxed">
            Arrive at Villa Pura and slip into a tropical haven of effortless relaxation. This two-story retreat blends a sleek kitchen, inviting lounge, and open dining area with views of the shimmering pool. Four elegant bedrooms, each with en-suite bathrooms, promise serene comfort.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
          Pererenan's Vibrant Charm
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <img
            src="/wp-content/uploads/villa-pura/balconyviewnight.jpeg"
            alt="Balcony view at night"
            className="w-full sm:w-1/2 h-64 sm:h-96 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <p className="text-lg sm:text-xl text-villa-charcoal leading-relaxed">
            Tucked in a tranquil enclave, Villa Pura harmonizes serene relaxation with effortless accessibility. Reach Central Canggu's vibrant beach bars and restaurants in a 5-minute scooter ride, Pererenan Beach in 3 minutes, or dine at LeBlon, Shelter, and Bar Vera in just 2 minutes. Stroll a mere 50 meters to enjoy Hula Cafe, Acme Coffee Roastery, or Noah Restaurant. Explore nearby cultural gems like Tanah Lot Temple within a 20-minute drive, or unwind with a yoga session at Canggu Yoga Centre, 10 minutes away.
          </p>
        </div>
      </section>
      
      <section className="bg-villa-white py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg sm:text-xl text-villa-charcoal leading-relaxed">
            Villa Pura is your refined retreat where Bali's enchanting charm meets modern luxury. Nestled near a sacred temple in Pererenan's vibrant hub, this 4-bedroom escape offers sleek design, airy spaces, and a serene connection to Bali's cultural soul.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;