// src/pages/RegisterGateway.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterGateway.css'; // We'll create this CSS file next

const RegisterGateway = () => {
  return (
    <div className="gateway-page">
      <div className="gateway-container">
        <h2>Join KalaKosha</h2>
        <p className="gateway-subtitle">Choose your path to celebrate Indian folk art.</p>
        <div className="gateway-options">
          <Link to="/register/user" className="gateway-option-card">
            <h3>As an Art Lover</h3>
            <p>Explore and purchase unique artworks, enroll in courses, and connect with artists.</p>
            <span className="btn btn-outline">Register as User</span>
          </Link>
          <Link to="/register/artist" className="gateway-option-card">
            <h3>As an Artist</h3>
            <p>Showcase your portfolio, sell your art and courses, and offer custom commissions.</p>
            <span className="btn btn-primary">Register as Artist</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterGateway;