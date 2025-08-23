import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing!')
      setEmail('')
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <div className="logo-image"></div>
              <h3>KalaKosha</h3>
            </div>
            <p className="footer-description">
              Celebrating art and creativity. Connect with artists and art enthusiasts from around the world.
            </p>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><Link to="/artworks">Gallery</Link></li>
              <li><Link to="/courses">Workshops</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#faqs">FAQs</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><a href="#support">Support</a></li>
              <li><Link to="/forum">Community</Link></li>
            </ul>
          </div>
          
          <div className="footer-column footer-subscribe">
            <h4>Newsletter</h4>
            <p>Get updates on new artworks and events</p>
            <form onSubmit={handleSubscribe} className="footer-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 KalaKosha. All rights reserved.
          </div>
          
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
          
          <div className="footer-social">
            <a href="#facebook" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer