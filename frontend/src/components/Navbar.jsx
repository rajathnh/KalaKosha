import React, { useState, useEffect } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Close the mobile menu when viewport grows (keeps state consistent)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMenuOpen])

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-image" aria-hidden="true"></div>
            <div className="logo-text">KalaKosha</div>
          </div>

          <div className="navbar-menu">
            <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
            <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
            <a href="#explore" onClick={() => scrollToSection('explore')}>Explore Art</a>
          </div>
        </div>

        <div className="navbar-right">
          <button id="register" className="btn btn-outline navbar-btn">Register</button>
          <button id="login" className="btn btn-primary navbar-btn">Log in</button>
        </div>

        {/* Mobile Hamburger Button */}
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
        <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
        <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
        <a href="#explore" onClick={() => scrollToSection('explore')}>Explore Art</a>
        <div className="mobile-auth">
          <button className="btn btn-outline">Register</button>
          <button className="btn btn-primary">Log in</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
