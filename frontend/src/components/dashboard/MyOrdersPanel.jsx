// src/components/dashboard/MyOrdersPanel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import '../../pages/ArtworkListPage.css'; // Reusing gallery styles

const MyOrdersPanel = () => {
  const [purchasedArtworks, setPurchasedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const response = await apiClient.get('/orders/my-collection');
        // Filter the results to only include artworks
        const artworks = response.data.items.filter(item => item.onModel === 'Artwork');
        setPurchasedArtworks(artworks);
      } catch (err) {
        console.error("Failed to fetch purchased artworks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchasedItems();
  }, []);

  if (loading) return <p>Loading your artwork orders...</p>;

  return (
    <div className="my-orders-panel">
      <h2>My Artwork Orders</h2>
      <p>A collection of all the unique artworks you have purchased.</p>
      <hr className='message1'/>
      {purchasedArtworks.length > 0 ? (
        <div className="artwork-grid">
          {purchasedArtworks.map(({ product }) => (
            <Link to={`/artworks/${product._id}`} key={product._id} className="artwork-card">
              <div className="artwork-card-image"><img src={product.image} alt={product.title} /></div>
              <div className="artwork-card-info">
                <h3>{product.title}</h3>
                <p>By {product.artist.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>You haven't purchased any artworks yet.</p>
      )}
    </div>
  );
};

export default MyOrdersPanel;