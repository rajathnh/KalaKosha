// src/pages/ArtistProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './ArtistProfilePage.css';

const ArtistProfilePage = () => {
  const { id: artistId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const { user } = useAuth(); // Get the current user
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArtistProfile = async () => {
      // Reset state on new ID
      setLoading(true);
      setError(null);
      setProfileData(null);
      
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
    // We pass the entire artist object in the navigation state
    const artistToContact = profileData.artist; 

    if (!user) {
      // If not logged in, redirect to login and remember to go to chat with this artist later
      navigate('/login', { state: { from: { pathname: '/chat' }, artist: artistToContact } });
    } else {
      // If logged in, go directly to chat, passing the artist's info
      navigate('/chat', { state: { artist: artistToContact } });
    }
  };
  // --- BULLETPROOF RENDER LOGIC ---

  // Display a loading message while fetching OR if data is not yet available
  if (loading || !profileData) {
    return <div className="container section"><h2>Loading Artist Profile...</h2></div>;
  }

  // Display an error message if the fetch failed
  if (error) {
    return <div className="container section"><p className="error-message">{error}</p></div>;
  }

  // If we've passed the checks above, profileData is guaranteed to be a valid object.
  // Now it's safe to destructure.
  const { artist, artworks, courses, commissionReviews } = profileData;

  // Additional check to ensure artist object exists
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
        {/* Artworks Section */}
        <section className="profile-section">
          <h2>Artworks for Sale ({artworks?.length || 0})</h2>
          {artworks && artworks.length > 0 ? (
            <div className="profile-grid">
              {artworks.map(art => (
                <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card">
                   <div className="artwork-card-image"><img src={art.image} alt={art.title} /></div>
                   <div className="artwork-card-info"><h3>{art.title}</h3><span>${art.price}</span></div>
                </Link>
              ))}
            </div>
          ) : <p>This artist has no artworks for sale yet.</p>}
        </section>

        {/* Courses Section */}
        <section className="profile-section">
          <h2>Courses ({courses?.length || 0})</h2>
          {courses && courses.length > 0 ? (
             <div className="profile-grid">
              {courses.map(course => (
                // We'll treat courses like artworks for display purposes
                // In a real app, you might create a dedicated CourseCard component
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

        {/* Commission Reviews Section */}
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