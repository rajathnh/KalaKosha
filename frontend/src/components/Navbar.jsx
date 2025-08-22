import React, { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-placeholder"></div>
          </div>
          <div className="navbar-menu">
            <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
            <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
            <a href="#explore" onClick={() => scrollToSection('explore')}>Explore Art</a>
          </div>
        </div>
        
        <div className="navbar-right">
          <button id="register" className="btn btn-outline navbar-btn">Register</button>
          <button id="login"className="btn btn-primary navbar-btn">Log in</button>
        </div>

        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
        <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
        <a href="#explore" onClick={() => scrollToSection('explore')}>Explore Art</a>
        <button className="btn btn-outline">Register</button>
        <button className="btn btn-primary">Log in</button>
      </div>
    </nav>
  )
}

export default Navbar
