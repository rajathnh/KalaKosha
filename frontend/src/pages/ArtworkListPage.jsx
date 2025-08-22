// src/pages/ArtworkListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './ArtworkListPage.css'; // We'll create this

const ArtworkListPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add state for pagination, filters, etc. later

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        // Using your powerful API with pagination
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

  if (loading) return <div className="container section"><h2>Loading Artworks...</h2></div>;

  return (
    <div className="artwork-list-page section">
      <div className="container">
        <h1 className="page-title">Explore Our Art Gallery</h1>
        {/* Add filter and sort controls here later */}
        <div className="artwork-grid">
          {artworks.map(art => (
            <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card">
              <div className="artwork-card-image">
                <img src={art.image} alt={art.title} />
              </div>
              <div className="artwork-card-info">
                <h3>{art.title}</h3>
                <p>By {art.artist.name}</p>
                <span>${art.price}</span>
              </div>
            </Link>
          ))}
        </div>
        {/* Add pagination buttons here later */}
      </div>
    </div>
  );
};

export default ArtworkListPage;