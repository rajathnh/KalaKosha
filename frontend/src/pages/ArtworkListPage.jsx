// src/pages/ArtworkListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './ArtworkListPage.css';

const ArtworkListPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/artworks?sort=latest&limit=12');
        setArtworks(response.data.artworks);
      } catch (err) {
        console.error("Failed to fetch artworks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container container section">
        <div className="spinner"></div>
        <h2>Loading Artworks...</h2>
      </div>
    );
  }

  return (
    <div className="artwork-list-page section">
      <div className="container">
        <div className="page-header text-center">
          <h1 className="page-title">Explore The Gallery</h1>
          <p className="page-subtitle">A curated collection of authentic works from India's most talented folk and traditional artists.</p>
        </div>
        
        {/* Filter and sort controls will go here */}
        
        <div className="artwork-grid">
          {artworks.map(art => (
            <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card">
              <div className="artwork-card-image-wrapper">
                <img src={art.image} alt={art.title} />
              </div>
              <div className="artwork-card-content">
                <h3 className="artwork-title">{art.title}</h3>
                <p className="artwork-artist">By {art.artist.name}</p>
              </div>
              <div className="artwork-card-overlay">
                <span className="artwork-price">${art.price}</span>
                <div className="artwork-cta">View Details</div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination buttons will go here */}
      </div>
    </div>
  );
};

export default ArtworkListPage;