import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './ArtistProfilePage.css';
// Reusing these styles for the cards
import './ArtworkListPage.css'; 

const ArtistProfilePage = () => {
  const { id: artistId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/artists/${artistId}`);
        setProfileData(response.data.profile);
      } catch (err) {
        setError('Could not find the requested artist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtistProfile();
  }, [artistId]);

  const handleContact = () => {
    const artistToContact = profileData.artist;
    if (!user) {
      navigate('/login', { 
        state: { 
          from: { pathname: `/chat/${artistToContact._id}` }, 
          recipient: artistToContact 
        } 
      });
    } else {
      navigate(`/chat/${artistToContact._id}`, { state: { recipient: artistToContact } });
    }
  };

  if (loading || !profileData) {
    return <div className="container section"><h2>Loading Artist Profile...</h2></div>;
  }
  if (error) {
    return <div className="container section"><p className="error-message">{error}</p></div>;
  }

  const { artist, artworksForSale, artworksSold, courses, commissionReviews } = profileData;

  if (!artist) {
    return <div className="container section"><h2>Artist data could not be loaded.</h2></div>;
  }

  return (
    <div className="artist-profile-page">
      <header className="artist-header section">
        <div className="container">
          <img src={artist.profilePicture} alt={artist.name} className="artist-avatar" />
          <h1>{artist.name}</h1>
          <p className="artist-specialization">{artist.specialization.join(', ')}</p>
          <div className="artist-rating">
            <span>⭐ {artist.averageRating ? artist.averageRating.toFixed(1) : 'N/A'}</span> 
            ({artist.numOfReviews} reviews)
          </div>
          <p className="artist-bio">{artist.bio}</p>
          <button onClick={handleContact} className="btn btn-primary">
            Contact for Commission
          </button>
        </div>
      </header>

      <main className="container section">
        {/* --- ARTWORKS FOR SALE SECTION --- */}
        <section className="profile-section">
          <h2>Artworks for Sale ({artworksForSale?.length || 0})</h2>
          {artworksForSale && artworksForSale.length > 0 ? (
            <div className="artwork-grid">
              {artworksForSale.map(art => (
                <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card">
                   <div className="artwork-card-image"><img src={art.image} alt={art.title} /></div>
                   <div className="artwork-card-info"><h3>{art.title}</h3><span>${art.price}</span></div>
                </Link>
              ))}
            </div>
          ) : <p>This artist has no artworks for sale yet.</p>}
        </section>

        {/* --- SOLD ARTWORKS SECTION --- */}
        <section className="profile-section">
          <h2>Portfolio of Sold Works ({artworksSold?.length || 0})</h2>
           {artworksSold && artworksSold.length > 0 ? (
            <div className="artwork-grid sold-gallery">
              {artworksSold.map(art => (
                // --- FIX #1: Changed from a <div> to a <Link> ---
                <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card sold">
                   <div className="artwork-card-image">
                        <img src={art.image} alt={art.title} />
                        <div className="sold-overlay">SOLD</div>
                   </div>
                   <div className="artwork-card-info">
                        <h3>{art.title}</h3>
                        {/* --- FIX #2: Added the final price --- */}
                        <span className="sold-price">Sold for ${art.price}</span>
                   </div>
                </Link>
              ))}
            </div>
          ) : <p>No sold works to display yet.</p>}
        </section>

        {/* --- COURSES SECTION --- */}
        <section className="profile-section">
          <h2>Courses ({courses?.length || 0})</h2>
          {courses && courses.length > 0 ? (
             <div className="artwork-grid"> {/* Reusing artwork grid style */}
              {courses.map(course => (
                <Link to={`/courses/${course._id}`} key={course._id} className="artwork-card">
                   <div className="artwork-card-image">
                        <img src={course.coverImage} alt={course.title} />
                   </div>
                   <div className="artwork-card-info">
                        <h3>{course.title}</h3>
                        <p>{course.difficulty} Level</p>
                        <span>${course.price}</span>
                   </div>
                </Link>
              ))}
             </div>
          ) : <p>This artist has no courses available yet.</p>}
        </section>

        {/* --- COMMISSION REVIEWS SECTION --- */}
        <section className="profile-section">
          <h2>Commission Reviews ({commissionReviews?.length || 0})</h2>
          {commissionReviews && commissionReviews.length > 0 ? (
            <div className="reviews-list">
              {commissionReviews.map(review => (
                <div key={review._id} className="review-card">
                  <h4>Review for "{review.commission?.title || 'a custom piece'}"</h4>
                  <p className="review-rating">Rating: {review.rating} / 5</p>
                  <p className="review-comment">"{review.comment}"</p>
                  <p className="review-author">- {review.customer?.name || 'A customer'}</p>
                </div>
              ))}
            </div>
          ) : <p>No commission reviews yet.</p>}
        </section>
      </main>
    </div>
  );
};

export default ArtistProfilePage;