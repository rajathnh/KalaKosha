import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import '../../pages/ArtistProfilePage.css'; 
import '../../pages/ArtworkListPage.css';

const MyArtworksPanel = () => {
  // --- FIX #1: INITIALIZE STATE WITH AN EMPTY ARRAY ---
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/artworks/my-artworks');
        setArtworks(response.data.artworks || []); // Safely default to an empty array
      } catch (err) {
        console.error("Failed to fetch artist's artworks", err);
        setError("Could not load your artworks.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  // --- FIX #2: ADD GUARD CLAUSES ---
  if (loading) {
    return <p>Loading your artworks...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // If we reach this point, 'artworks' is guaranteed to be an array.
  return (
    <div className="my-artworks-panel">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>My Artworks Inventory</h2>
        <Link to="/artworks/create" className="btn btn-primary">
          + Add New Artwork
        </Link>
      </div>
      {artworks.length > 0 ? (
        <div className="artwork-grid">
          {artworks.map((art) => (
           <Link to={`/artworks/${art._id}`} key={art._id} className={`artwork-card ${art.status === 'Sold' ? 'sold' : ''}`}>
              <div className="artwork-card-image">
                <img src={art.image} alt={art.title} />
                {art.status === 'Sold' && <div className="sold-overlay">SOLD</div>}
              </div>
              <div className="artwork-card-info">
                <h3>{art.title}</h3>
                <p>Status: <strong>{art.status}</strong></p>
              </div>
            </Link>
            ))}
        </div>
      ) : (
     
        <p>You haven't uploaded any artworks yet. Click the button above to add your first piece!</p>
      )}
    </div>
  );
};

export default MyArtworksPanel;