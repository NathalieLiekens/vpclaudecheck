import React from 'react';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const reviews = [
    {
      name: 'Edric',
      date: 'May 2025',
      rating: 5,
      text: 'The villa was beautiful, spacious, and clean. The host was responsive, arranging early check-in, late check-out, airport pick-up, and a scooter waiting at the villa. Check-in was easy, with the housekeeper Wayan waiting with fruit plates and welcome drinks. Daily cleaning with fresh towels was appreciated. The location was fantastic yet quiet on a small side road. The pool was awesome, and we enjoyed our time there. Only wished for more pillows and a longer stay.',
    },
    {
      name: 'Lera',
      date: 'February 2025',
      rating: 5,
      text: 'Great location, I really love Pererenan. If you are reading this - don\'t stay in Canggu, stay in this area. The villa has a great big pool, we even did sound healing on water mattresses.',
    },
    {
      name: 'Lex',
      date: 'December 2024',
      rating: 5,
      text: 'We had a great stay! It was quiet but very close to all the good restaurants. Cleaning was great, and overall we enjoyed our stay very much.',
    },
    {
      name: 'Aymeric',
      date: 'August 2024',
      rating: 5,
      text: 'The staff was amazing, helping with every need, and the house was beautiful. It matched the pictures and was an amazing stay!',
    },
    {
      name: 'Anthony',
      date: 'June 2024',
      rating: 5,
      text: 'Beautiful large villa in a quiet, peaceful area. Wayan the housekeeper does an excellent job cleaning daily, keeping the villa spotless. The pool is lovely for laps or chilling out. Pererenan is up-and-coming, not too busy yet, with many excellent restaurants and cafes. Canggu is a short scooter ride away with a hectic tourism scene. It was a great week chilling at the villa.',
    },
    {
      name: 'Ebony',
      date: 'June 2024',
      rating: 5,
      text: 'A beautiful villa, I stayed with 5 friends, and it was perfect! Wayan the housekeeper was so helpful and attentive, organizing a surprise for my friend’s birthday. We had massages at the villa! I will stay here again.',
    },
    {
      name: 'Fina',
      date: 'January 2025',
      rating: 5,
      text: 'Our family loved spending time in the pool. Wayan made our stay even better.',
    },
    {
      name: 'Gina',
      date: 'January 2025',
      rating: 5,
      text: 'Great stay at Villa Pura, Wayan was a great host and very helpful with our needs.',
    },
    {
      name: 'Sam',
      date: 'December 2024',
      rating: 5,
      text: 'One of the best places we stayed. Great villa and perfect location.',
    },
    {
      name: 'Nashee',
      date: 'November 2024',
      rating: 5,
      text: 'Our stay at Villa Pura in Pererenan was perfect—an experience we’ll cherish forever. The villa is a stunning sanctuary, blending modern luxury with Balinese charm. Every corner exudes elegance and tranquility, from spacious, decorated living areas to serene bedrooms with restful sleep. The lush gardens and sparkling pool were our slice of paradise. Wayan, our housekeeper, welcomed us with warmth and kindness, ensuring every need was met. The location was perfect, quiet yet close to Pererenan’s vibrant cafes, beaches, and attractions. We can’t wait to return.',
    },
    {
      name: 'Sarah',
      date: 'May 2024',
      rating: 5,
      text: 'Great value, perfect location for a nearby wedding. Hula Cafe across the road was awesome, and the nearest mini-mart was a 4-minute walk. Gojek bikes were 1-3 minutes away, cars 5-7. Suited our group as all rooms had bathrooms and fabulous communal areas. We were so happy and can’t wait to come back.',
    },
    {
      name: 'Sjoerd',
      date: 'December 2023',
      rating: 5,
      text: 'Amazingly clean and spotlessly manicured. Staff so lovely, and decorations create a happy mood. Beds are very comfortable. Perfect central location on a quiet street. Great value, highly recommend.',
    },
    {
      name: 'Gladys',
      date: 'May 2024',
      rating: 5,
      text: 'Great stay at Villa Pura. The villa is new, spacious, nicely decorated, and so clean. The giant pool was amazing, especially in the hot weather. Will come back for sure.',
    },
    {
      name: 'Henri',
      date: 'January 2024',
      rating: 5,
      text: 'Great villa in a great location, a short bike ride from Batu Bolong for easy access to Canggu but on a quieter road with many restaurants and cafes nearby. The villa was as described, very spacious with good-sized bedrooms and high-quality furniture. The pool area is great with lots of space. The pool was quite warm, a shame when needing to cool down from the Bali sun! Overall, a fantastic place, highly recommend.',
    },
    {
      name: 'Nathalie',
      date: 'November 2023',
      rating: 5,
      text: 'Best place we stayed in Bali! More spacious than photos suggest. Amazing villa with everything needed (even a coffee machine for addicts like me ;)). Wayan gave a warm welcome and made our stay pleasant. It’s brand-new, beautifully decorated, with a huge colorful garden, a Balinese temple, and a pool for laps. Big, clean rooms ensure private space for groups, with two lovely living areas. Not far from the beach, in a peaceful area away from the road, with many cafes and restaurants in walking distance. Definitely coming back!',
    },
    {
      name: 'Emily',
      date: 'April 2024',
      rating: 5,
      text: 'Beautiful villa, peaceful but close to restaurants, shops, etc. Wayan the housekeeper was very lovely ☺️',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 bg-villa-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-villa-charcoal playfair-display">
        Guest Reviews
      </h1>
      <div className="max-w-3xl mx-auto text-villa-charcoal">
        <p className="mb-6 text-base sm:text-lg leading-relaxed">
          Hear from our guests about their experience at Villa Pura Bali. Ready to book? Visit our <Link to="/booking" className="text-villa-green hover:underline link-visible">Booking page</Link>.
        </p>
        {reviews.map((review, index) => (
          <div key={index} className="mb-6 border-l-4 border-villa-green pl-4">
            <h3 className="text-lg sm:text-xl font-semibold">{review.name}</h3>
            <p className="text-sm text-villa-charcoal/70">{review.date}</p>
            <p className="mt-2 text-base sm:text-lg">{review.text}</p>
            <p className="mt-1 text-sm">Rating: {review.rating}/5</p>
          </div>
        ))}
        <p className="mt-6 italic text-sm">
          Reviews sourced from Airbnb. Additional reviews will be integrated with our property management system (Guesty) upon backend setup.
        </p>
      </div>
    </div>
  );
};

export default Reviews;