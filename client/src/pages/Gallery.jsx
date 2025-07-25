import React, { useState } from 'react';

// WordPress-compatible image paths
const photos = [
  { src: '/wp-content/uploads/villa-pura/balconyviewday.jpeg', alt: 'Balcony view during the day', caption: 'Breathtaking Daytime Balcony Vista', isNight: false },
  { src: '/wp-content/uploads/villa-pura/balconyviewnight.jpeg', alt: 'Balcony view at night', caption: 'Enchanting Twilight Balcony Glow', isNight: true },
  { src: '/wp-content/uploads/villa-pura/bathroom1.jpeg', alt: 'Bathroom 1', caption: 'Serene Spa-Inspired Retreat', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bathroom2.jpeg', alt: 'Bathroom 2', caption: 'Elegant Bath Retreat', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bathroom3.jpeg', alt: 'Bathroom 3', caption: 'Modern Bath Oasis', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bed1.jpeg', alt: 'Bedroom 1', caption: 'Master Bedroom Serenity', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bed2.jpeg', alt: 'Bedroom 2', caption: 'Cozy Guest Bedroom', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bed3.jpeg', alt: 'Bedroom 3', caption: 'Tranquil Sleep Haven', isNight: false },
  { src: '/wp-content/uploads/villa-pura/bed4.jpeg', alt: 'Bedroom 4', caption: 'Restful Bedroom Escape', isNight: false },
  { src: '/wp-content/uploads/villa-pura/diningday1.jpeg', alt: 'Dining area day 1', caption: 'Elegant Dining Space', isNight: false },
  { src: '/wp-content/uploads/villa-pura/diningday2.jpeg', alt: 'Dining area day 2', caption: 'Bright Dining Nook', isNight: false },
  { src: '/wp-content/uploads/villa-pura/diningday3.jpeg', alt: 'Dining area day 3', caption: 'Open Dining Area', isNight: false },
  { src: '/wp-content/uploads/villa-pura/diningnight1.jpeg', alt: 'Dining area at night 1', caption: 'Evening Dining Glow', isNight: true },
  { src: '/wp-content/uploads/villa-pura/diningnight2.jpeg', alt: 'Dining area at night 2', caption: 'Nighttime Dining Ambiance', isNight: true },
  { src: '/wp-content/uploads/villa-pura/entryday.jpeg', alt: 'Entry during the day', caption: 'Welcoming Daytime Entry', isNight: false },
  { src: '/wp-content/uploads/villa-pura/entrynight.jpeg', alt: 'Entry at night', caption: 'Charming Night Entry', isNight: true },
  { src: '/wp-content/uploads/villa-pura/hero.jpg', alt: 'Villa overview', caption: 'Villa Pura Bali Exterior', isNight: false },
  { src: '/wp-content/uploads/villa-pura/kitchen1.jpeg', alt: 'Kitchen 1', caption: 'Modern Kitchen Elegance', isNight: false },
  { src: '/wp-content/uploads/villa-pura/kitchen2.jpeg', alt: 'Kitchen 2', caption: 'Functional Kitchen Space', isNight: false },
  { src: '/wp-content/uploads/villa-pura/kubuday.jpeg', alt: 'Kubu during the day', caption: 'Traditional Kubu Lounge', isNight: false },
  { src: '/wp-content/uploads/villa-pura/kubunight.jpeg', alt: 'Kubu at night', caption: 'Kubu Under the Stars', isNight: true },
  { src: '/wp-content/uploads/villa-pura/livingroom1.jpeg', alt: 'Living room 1', caption: 'Spacious Living Area', isNight: false },
  { src: '/wp-content/uploads/villa-pura/livingroom2.jpeg', alt: 'Living room 2', caption: 'Cozy Living Corner', isNight: false },
  { src: '/wp-content/uploads/villa-pura/livingroom3.jpeg', alt: 'Living room 3', caption: 'Bright Living Space', isNight: false },
  { src: '/wp-content/uploads/villa-pura/outsidearea.jpeg', alt: 'Outside area', caption: 'Lush Outdoor Retreat', isNight: false },
  { src: '/wp-content/uploads/villa-pura/pool1.jpeg', alt: 'Pool area', caption: 'Inviting Poolside Sanctuary', isNight: false },
  { src: '/wp-content/uploads/villa-pura/poolnight.jpeg', alt: 'Pool area at night', caption: 'Twilight Pool Glow', isNight: true },
  { src: '/wp-content/uploads/villa-pura/poolsunlounges.jpeg', alt: 'Pool with sun lounges', caption: 'Poolside Sun Lounges', isNight: false },
  { src: '/wp-content/uploads/villa-pura/sunlounges2.jpeg', alt: 'Sun lounges', caption: 'Relaxing Sun Lounges', isNight: false },
  { src: '/wp-content/uploads/villa-pura/sunloungesnight.jpeg', alt: 'Sun lounges at night', caption: 'Evening Lounge Serenity', isNight: true },
  { src: '/wp-content/uploads/villa-pura/tvroom.jpeg', alt: 'TV room', caption: 'Cozy Entertainment Haven', isNight: false },
];

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredPhotos = photos.filter((photo) => {
    if (filter === 'day') return !photo.isNight;
    if (filter === 'night') return photo.isNight;
    return true;
  });

  const dayPhotos = photos.filter(p => !p.isNight);
  const nightPhotos = photos.filter(p => p.isNight);

  const openImage = (photo) => {
    setSelectedImage(photo);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-villa-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-villa-charcoal playfair-display mb-4">
            Explore Villa Pura's Gallery
          </h1>
          <p className="text-lg sm:text-xl text-villa-charcoal max-w-3xl mx-auto">
            Immerse yourself in the beauty of Villa Pura through stunning visuals, capturing its luxurious spaces by day and enchanting ambiance by night.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-villa-green ${
                filter === 'all' 
                  ? 'bg-villa-green text-white shadow-md' 
                  : 'bg-gray-200 text-villa-charcoal hover:bg-gray-300'
              }`}
              onClick={() => setFilter('all')}
            >
              All Photos ({photos.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-villa-green ${
                filter === 'day' 
                  ? 'bg-villa-green text-white shadow-md' 
                  : 'bg-gray-200 text-villa-charcoal hover:bg-gray-300'
              }`}
              onClick={() => setFilter('day')}
            >
              ☀️ Daytime ({dayPhotos.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-villa-green ${
                filter === 'night' 
                  ? 'bg-villa-green text-white shadow-md' 
                  : 'bg-gray-200 text-villa-charcoal hover:bg-gray-300'
              }`}
              onClick={() => setFilter('night')}
            >
              🌙 Nighttime ({nightPhotos.length})
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div key={index} className="relative group cursor-pointer" onClick={() => openImage(photo)}>
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-80 object-cover rounded-lg shadow-md transition-all duration-300 group-hover:scale-105"
              />
              
              {/* Caption */}
              <p className="text-villa-charcoal text-sm mt-2 text-center font-medium">
                {photo.caption}
              </p>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                  Click to View
                </span>
              </div>
              
              {/* Day/Night badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  photo.isNight 
                    ? 'bg-indigo-500/80 text-white' 
                    : 'bg-yellow-400/80 text-yellow-900'
                }`}>
                  {photo.isNight ? '🌙 Night' : '☀️ Day'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for full-size image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeImage}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: '95vw', maxHeight: '95vh' }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={closeImage}
                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black bg-opacity-50 p-2 rounded">
                <p className="text-lg font-medium">{selectedImage.caption}</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-villa-charcoal mb-4">
            Ready to Experience Villa Pura?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            From serene mornings by the pool to magical evenings under the stars, 
            Villa Pura offers the perfect backdrop for your Bali getaway.
          </p>
          <div className="space-x-4">
            <a
              href="/booking"
              className="inline-block bg-villa-green text-white px-8 py-3 rounded-lg hover:bg-villa-charcoal transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-villa-green"
            >
              Book Your Stay
            </a>
            <a
              href="/contact"
              className="inline-block bg-gray-200 text-villa-charcoal px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Ask Questions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;