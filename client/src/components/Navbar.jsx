import { useState } from 'react';
  import { Link } from 'react-router-dom';

  const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    return (
      <nav className="bg-villa-charcoal text-villa-white fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
          {/* Logo or Site Title */}
          <Link to="/" className="text-xl font-bold">
            Villa Pura
          </Link>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <div className="hamburger">
              <span className={`block w-6 h-0.5 bg-villa-white mb-1.5 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-villa-white mb-1.5 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-villa-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>

          {/* Menu Items */}
          <div
            className={`md:flex md:items-center md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-villa-charcoal md:bg-transparent transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
            } overflow-hidden md:overflow-visible`}
          >
            <Link
              to="/"
              className="block py-2 px-4 md:p-0 hover:text-villa-green transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 px-4 md:p-0 hover:text-villa-green transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/booking"
              className="block py-2 px-4 md:p-0 hover:text-villa-green transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Booking
            </Link>
            <Link
              to="/gallery"
              className="block py-2 px-4 md:p-0 hover:text-villa-green transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="block py-2 px-4 md:p-0 hover:text-villa-green transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;