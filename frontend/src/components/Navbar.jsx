import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Your import for routing
import { useAuth } from '../context/AuthContext';    // Your import for auth state
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- YOUR LOGIC ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/');       // Redirect to home
  };
  // --- END YOUR LOGIC ---


  // --- TEAMMATE'S LOGIC ---
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const scrollToSection = (sectionId) => {
    // We navigate to the homepage first to ensure the section exists
    navigate('/');
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100); // Small delay to allow navigation
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen]);
  // --- END TEAMMATE'S LOGIC ---

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-container">
        <div className="navbar-left">
          {/* MERGED: Logo is now a Link to home */}
          <Link to="/" className="navbar-logo">
            <div className="logo-image" aria-hidden="true"></div>
            <div className="logo-text">KalaKosha</div>
          </Link>

          <div className="navbar-menu">
            {/* MERGED: Links now use smart scrolling */}
            <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
            <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
            {/* MERGED: Explore Art is a Link to a separate page */}
            <Link to="/artworks">Explore Art</Link>
          </div>
        </div>

        <div className="navbar-right">
          {/* MERGED: Your authentication logic is applied here */}
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-primary navbar-btn">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/register" id="register" className="btn btn-outline navbar-btn">
                Register
              </Link>
              <Link to="/login" id="login" className="btn btn-primary navbar-btn">
                Log in
              </Link>
            </>
          )}
        </div>

        {/* TEAMMATE'S IMPROVED HAMBURGER BUTTON */}
        <button
          className={`navbar-mobile-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          type="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        {/* MERGED: Links and buttons are all updated */}
        <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
        <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
        <Link to="/artworks" onClick={() => setIsMenuOpen(false)}>Explore Art</Link>
        <div className="mobile-auth">
          {user ? (
            <button onClick={handleLogout} className="btn btn-primary">Log Out</button>
          ) : (
            <>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-outline">Register</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary">Log in</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;