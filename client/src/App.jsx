import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import TermsAndConditions from "./pages/TermsAndConditions";
import Pricing from "./pages/Pricing";
import FAQs from "./pages/FAQs";
import LocalGuide from "./pages/LocalGuide";
import Reviews from "./pages/Reviews";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SuccessPage from "./pages/SuccessPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { initGA, trackPageView, villaTracking } from './utils/analytics';

// Page tracking component
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on first load
    initGA();
  }, []);

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
    
    // Track specific page events
    switch (location.pathname) {
      case '/gallery':
        villaTracking.galleryViewed();
        break;
      case '/pricing':
        villaTracking.pricingViewed();
        break;
      case '/reviews':
        villaTracking.reviewsViewed();
        break;
      case '/local-guide':
        villaTracking.localGuideViewed();
        break;
    }
  }, [location]);

  return null; // This component doesn't render anything
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="bg-villa-white">
        <nav className="bg-villa-white text-villa-charcoal py-4 px-4 sticky top-0 shadow-sm z-50">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center sm:px-6">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <Link to="/" className="text-lg sm:text-xl font-bold">
                Villa Pura Bali
              </Link>
              <button
                className="sm:hidden flex items-center justify-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-villa-green rounded"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <div className="hamburger">
                  <span className={`block w-6 h-0.5 bg-villa-charcoal mb-1.5 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-villa-charcoal mb-1.5 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-villa-charcoal transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
            
            <div
              id="mobile-menu"
              className={`sm:flex sm:items-center sm:gap-6 w-full sm:w-auto transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100 mt-4 sm:mt-0' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'
              } overflow-hidden sm:overflow-visible flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 text-sm sm:text-base`}
            >
              <Link
                to="/"
                className="hover:text-villa-green transition-colors py-2 sm:py-0 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-villa-green transition-colors py-2 sm:py-0 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/gallery"
                className="hover:text-villa-green transition-colors py-2 sm:py-0 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/booking"
                className="hover:text-villa-green transition-colors py-2 sm:py-0 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Booking
              </Link>
              
              {/* Desktop Dropdown */}
              <div className="relative sm:block hidden dropdown-container">
                <button
                  onClick={toggleDropdown}
                  className="hover:text-villa-green transition-colors py-2 sm:py-0 text-sm sm:text-base focus:outline-none focus:text-villa-green flex items-center"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  Discover
                  <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-villa-white shadow-lg rounded-md z-50 border border-gray-200"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to="/pricing"
                      className="block px-4 py-2 text-villa-charcoal hover:bg-villa-green hover:text-villa-white transition-colors focus:outline-none focus:bg-villa-green focus:text-villa-white"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      Pricing
                    </Link>
                    <Link
                      to="/faqs"
                      className="block px-4 py-2 text-villa-charcoal hover:bg-villa-green hover:text-villa-white transition-colors focus:outline-none focus:bg-villa-green focus:text-villa-white"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      FAQs
                    </Link>
                    <Link
                      to="/local-guide"
                      className="block px-4 py-2 text-villa-charcoal hover:bg-villa-green hover:text-villa-white transition-colors focus:outline-none focus:bg-villa-green focus:text-villa-white"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      Local Guide
                    </Link>
                    <Link
                      to="/reviews"
                      className="block px-4 py-2 text-villa-charcoal hover:bg-villa-green hover:text-villa-white transition-colors focus:outline-none focus:bg-villa-green focus:text-villa-white"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      Reviews
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Items */}
              <Link
                to="/pricing"
                className="sm:hidden hover:text-villa-green transition-colors py-2 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/faqs"
                className="sm:hidden hover:text-villa-green transition-colors py-2 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>
              <Link
                to="/local-guide"
                className="sm:hidden hover:text-villa-green transition-colors py-2 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Local Guide
              </Link>
              <Link
                to="/reviews"
                className="sm:hidden hover:text-villa-green transition-colors py-2 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Reviews
              </Link>
              <Link
                to="/contact"
                className="hover:text-villa-green transition-colors py-2 sm:py-0 focus:outline-none focus:text-villa-green"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/local-guide" element={<LocalGuide />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        
        <footer className="bg-villa-charcoal text-villa-white py-6 mt-12">
          <div className="container mx-auto px-4 sm:px-6 text-center space-y-2">
            <p className="text-sm">
              © {new Date().getFullYear()} Villa Pura Bali. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/terms-and-conditions"
                className="text-villa-green hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-villa-green rounded"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="text-villa-green hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-villa-green rounded"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;