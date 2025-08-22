import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'
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
          <div className="footer-column">
            <div className="footer-logo">
              <h3>KalaKosha</h3>
            </div>
            <p className="footer-copyright">
              © 2025 KalaKosha. All rights reserved.
            </p>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#support">Support</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#gallery">Art Gallery</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#workshops">Workshops</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Stay Connected</h4>
            <ul>
              <li><a href="#social">Social Media</a></li>
              <li><a href="#newsletter">Newsletter</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#join">Join Us</a></li>
              <li><a href="#updates">Get Updates</a></li>
            </ul>
          </div>
          
          <div className="footer-column footer-subscribe">
            <h4>Subscribe</h4>
            <p>Join our newsletter for the latest updates and features.</p>
            <form onSubmit={handleSubscribe} className="footer-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            <p className="footer-privacy">
              By subscribing, you agree to our <a href="#privacy">Privacy Policy</a> and receive updates.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookies Settings</a>
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
            <a href="#youtube" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
