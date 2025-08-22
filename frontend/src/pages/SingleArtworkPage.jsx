import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- Make sure useNavigate is imported
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext'; // <-- STEP 1: IMPORT THE HOOK
import './SingleArtworkPage.css';

const SingleArtworkPage = () => {
  const { id: artworkId } = useParams(); // <-- This hook gets the ':id' from the URL
  const [artwork, setArtwork] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
     const { user } = useAuth(); // <-- STEP 2: GET THE USER FROM THE CONTEXT
  const navigate = useNavigate(); // <-- Get the navigate function for redirection
  useEffect(() => {
    const fetchArtworkAndReviews = async () => {
      try {
        setLoading(true);
        // Use Promise.all to fetch artwork details and reviews in parallel
        const artworkPromise = apiClient.get(`/artworks/${artworkId}`);
        const reviewsPromise = apiClient.get(`/reviews/Artwork/${artworkId}`);
        
        const [artworkResponse, reviewsResponse] = await Promise.all([
          artworkPromise,
          reviewsPromise,
        ]);

        setArtwork(artworkResponse.data.artwork);
        setReviews(reviewsResponse.data.reviews);
        setError(null);
      } catch (err) {
        setError('Failed to load artwork details. It may have been removed or the link is incorrect.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkAndReviews();
  }, [artworkId]); // Re-run this effect if the artworkId in the URL changes

  if (loading) return <div className="container section"><h2>Loading Artwork...</h2></div>;
  if (error) return <div className="container section"><p className="error-message">{error}</p></div>;
  if (!artwork) return null; // Or a "not found" component
const handleBuyNow = () => {
    if (!user) {
      // If the user isn't logged in, redirect them to login
      // and "remember" that they wanted to go to the checkout page
      navigate('/login', { state: { from: { pathname: `/checkout/${artworkId}` } } });
    } else {
      // If they are logged in, take them directly to the checkout page
      navigate(`/checkout/${artworkId}`);
    }
  };
  return (
    <div className="single-artwork-page section">
      <div className="container">
        <div className="artwork-main-layout">
          <div className="artwork-image-container">
            <img src={artwork.image} alt={artwork.title} />
          </div>
          <div className="artwork-details-container">
            <h1>{artwork.title}</h1>
            <Link to={`/artists/${artwork.artist._id}`} className="artist-link">
              By {artwork.artist.name}
            </Link>
            <p className="artwork-price">${artwork.price}</p>
            <p className="artwork-description">{artwork.description}</p>
            <div className="artwork-meta">
              <span><strong>Art Form:</strong> {artwork.artForm}</span>
              <span><strong>Status:</strong> {artwork.status}</span>
            </div>
            {artwork.status === 'For Sale' && (
    <button onClick={handleBuyNow} className="btn btn-primary buy-button">
      Buy Now
    </button>
  )}
          </div>
        </div>

        <div className="artwork-reviews-section">
          <h2>Reviews ({artwork.numOfReviews})</h2>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <h4>{review.title}</h4>
                  <p className="review-rating">Rating: {review.rating} / 5</p>
                  <p className="review-comment">"{review.comment}"</p>
                  <p className="review-author">- {review.user.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet for this artwork.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleArtworkPage;