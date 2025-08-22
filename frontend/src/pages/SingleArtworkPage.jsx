import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import './SingleArtworkPage.css';

const SingleArtworkPage = () => {
    const { id: artworkId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Data state
    const [artwork, setArtwork] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    // Status state
    const [reviewStatus, setReviewStatus] = useState({ hasPurchased: false, hasReviewed: false });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        // Don't reset loading to true on manual refetch, only on initial load
        try {
            const artworkPromise = apiClient.get(`/artworks/${artworkId}`);
            const reviewsPromise = apiClient.get(`/reviews/Artwork/${artworkId}`);
            const promises = [artworkPromise, reviewsPromise];

            if (user) {
                const statusPromise = apiClient.get(`/orders/status/Artwork/${artworkId}`);
                promises.push(statusPromise);
            }
            
            const responses = await Promise.all(promises);
            
            setArtwork(responses[0].data.artwork);
            setReviews(responses[1].data.reviews);
            if (user) {
                setReviewStatus(responses[2].data);
            }
        } catch (err) {
            setError('Failed to load artwork details. The item may no longer exist.');
        } finally {
            setLoading(false);
        }
    }, [artworkId, user]);

    useEffect(() => {
        setLoading(true); // Set loading to true only on initial mount or ID change
        fetchData();
    }, [fetchData]);

    const handleBuyNow = () => {
        const checkoutUrl = `/checkout/artwork/${artworkId}`;
        if (!user) {
            navigate('/login', { state: { from: { pathname: checkoutUrl } } });
        } else {
            navigate(checkoutUrl);
        }
    };

    const handleReviewSubmitted = async () => {
        setShowReviewForm(false);
        setReviewStatus(prev => ({ ...prev, hasReviewed: true })); // Optimistic update
        await fetchData(); // Full refresh from server
    };

    if (loading) return <div className="container section"><h2>Loading Artwork...</h2></div>;
    if (error) return <div className="container section"><p className="error-message">{error}</p></div>;
    if (!artwork) return <div className="container section"><h2>Artwork not found.</h2></div>;

    const canLeaveReview = user && reviewStatus.hasPurchased && !reviewStatus.hasReviewed;

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
                            <button onClick={handleBuyNow} className="btn btn-primary buy-button">Buy Now</button>
                        )}
                        {artwork.status === 'Sold' && (
                            <p className="sold-notice">This artwork has been sold.</p>
                        )}
                    </div>
                </div>

                <div className="artwork-reviews-section">
                    <h2>Reviews ({reviews.length})</h2>

                    {/* Show the button ONLY if the user is eligible to leave a review */}
                    {canLeaveReview && !showReviewForm && (
                        <div className="review-prompt">
                            <button onClick={() => setShowReviewForm(true)} className="btn btn-outline">
                                Leave a Review
                            </button>
                        </div>
                    )}

                    {/* Show the form ONLY if the button has been clicked */}
                    {canLeaveReview && showReviewForm && (
                        <ReviewForm 
                          productId={artworkId} 
                          productType="Artwork"
                          onReviewSubmit={handleReviewSubmitted}
                        />
                    )}

                    {/* Show a message if a user has already reviewed this item */}
                    {user && reviewStatus.hasReviewed && (
                        <div className="review-prompt">
                            <p><strong>Thank you! You've already reviewed this artwork.</strong></p>
                        </div>
                    )}

                    {/* Always render the list of existing reviews */}
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
                        // Only show "no reviews yet" if they haven't just submitted one
                        !reviewStatus.hasReviewed && <p>No reviews yet for this artwork.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleArtworkPage;