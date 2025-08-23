import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title">
              Celebrate the Vibrancy of Indian Folk Art
            </h1>
            <p className="hero-subtitle">
              Join a thriving community of artists and enthusiasts dedicated to preserving India's rich artistic heritage. Explore, create, and connect with the beauty of folk art today!
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary hero-btn">Register</button>
              <button className="btn btn-outline hero-btn" onClick={() => navigate('/artworks')}>Explore</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
