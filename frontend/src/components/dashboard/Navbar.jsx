import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import NotificationBell from './NotificationBell';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleHomeClick = useCallback(() => {
    if (user) {
      if (user.role === 'artist') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
      // Small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.getElementById('home');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  }, [user, navigate]);

  const scrollToSection = useCallback((sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  }, [navigate, location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <div className="logo-image" aria-hidden="true"></div>
            <div className="logo-text">KalaKosha</div>
          </Link>

          <div className="navbar-menu">
            <button className="nav-link-button" onClick={handleHomeClick}>
              Home
            </button>
            <button className="nav-link-button" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
            <Link to="/artworks">Explore Art</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/discover">Discover</Link>
            <Link to="/blog">Blogs</Link>
            <Link to="/forum">Community</Link>
            <Link to="/events">Events</Link>
          </div>
        </div>

        <div className="navbar-right">
          {user ? (
            <><NotificationBell />
              <Link to={user.role === 'artist' ? `/dashboard` : '/dashboard'} className="greet-link" aria-label="View your profile"><span className="greet">Hello, {user.name}</span>
              </Link>
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
        <button className="nav-link-button mobile-nav-item" onClick={handleHomeClick}>
          Home
        </button>
        <button className="nav-link-button mobile-nav-item" onClick={() => scrollToSection('contact')}>
          Contact
        </button>
        <Link to="/artworks" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Explore Art</Link>
        <Link to="/courses" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Courses</Link>
        <Link to="/blog" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Blog</Link>
        <Link to="/forum" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Community</Link>
        <div className="mobile-auth">
          {user ? (
            <button onClick={handleLogout} className="btn btn-primary mobile-auth-btn">Log Out</button>
          ) : (
            <>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} id="register" className="btn btn-outline mobile-auth-btn">Register</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} id="login" className="btn btn-primary mobile-auth-btn">Log in</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;