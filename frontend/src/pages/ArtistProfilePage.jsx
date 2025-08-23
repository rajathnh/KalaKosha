// src/pages/ArtistProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './ArtistProfilePage.css';
import './ArtworkListPage.css'; 
import Badge from '../components/Badge';

const ArtistProfilePage = () => {
  const { id: artistId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ... (your data fetching logic remains the same)
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
    // ... (your contact logic remains the same)
    const artistToContact = profileData.artist;
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/chat/${artistToContact._id}` }, recipient: artistToContact } });
    } else {
      navigate(`/chat/${artistToContact._id}`, { state: { recipient: artistToContact } });
    }
  };

  if (loading || !profileData) {
    // A better loading state
    return (
      <div className="loading-container container section">
        <div className="spinner"></div>
        <h2>Loading Artist Profile...</h2>
      </div>
    );
  }

  if (error) return <div className="container section"><p className="error-message">{error}</p></div>;

  const { artist, artworksForSale, artworksSold, courses, commissionReviews } = profileData;

  if (!artist) return <div className="container section"><h2>Artist data could not be loaded.</h2></div>;

  return (
    <div className="artist-profile-page container section">
      <div className="profile-layout">
        
        {/* --- LEFT "STICKY" SIDEBAR --- */}
        <aside className="profile-sidebar">
          <div className="sidebar-content">
            <img src={artist.profilePicture} alt={artist.name} className="artist-avatar" />
            <h1 className="artist-name">{artist.name}</h1>
            <div className="sidebar-section-header">
      <h3>Achievements</h3>
      <Link to="/badge-system" className="learn-more-link" aria-label="Learn more about our badge system">
        ?
      </Link>
    </div>
            <div className="artist-badges-container">
              <Badge type="artwork" tier={artist.artworkBadgeTier} />
              <Badge type="course" tier={artist.courseBadgeTier} />
              <Badge type="blog" tier={artist.blogBadgeTier} />
            </div>
            

            <p className="artist-specialization">{artist.specialization.join(', ')}</p>
            <div className="artist-rating">
              <span>⭐ {artist.averageRating ? artist.averageRating.toFixed(1) : 'N/A'}</span> 
              ({artist.numOfReviews} reviews)
            </div>
            <p className="artist-bio">{artist.bio}</p>
            <button onClick={handleContact} className="btn btn-primary contact-btn">
              Contact for Commission
            </button>
          </div>
        </aside>

        {/* --- RIGHT MAIN CONTENT AREA --- */}
        <main className="profile-main-content">
          {/* ARTWORKS FOR SALE */}
          <section id="for-sale" className="profile-section">
            <h2 className="section-title">Artworks for Sale ({artworksForSale?.length || 0})</h2>
            {artworksForSale?.length > 0 ? (
              <div className="artwork-grid">
                {artworksForSale.map(art => (
                  <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card">
                    <div className="artwork-card-image-wrapper"><img src={art.image} alt={art.title} /></div>
                    <div className="artwork-card-content">
                      <h3 className="artwork-title">{art.title}</h3>
                    </div>
                    <div className="artwork-card-overlay">
                      <span className="artwork-price">${art.price}</span>
                      <div className="artwork-cta">View Details</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <p className="empty-state">This artist has no artworks for sale yet.</p>}
          </section>

          {/* PORTFOLIO OF SOLD WORKS */}
          <section id="portfolio" className="profile-section">
            <h2 className="section-title">Portfolio of Sold Works ({artworksSold?.length || 0})</h2>
            {artworksSold?.length > 0 ? (
              <div className="artwork-grid sold-gallery">
                {artworksSold.map(art => (
                  <Link to={`/artworks/${art._id}`} key={art._id} className="artwork-card sold">
                    <div className="artwork-card-image-wrapper">
                      <img src={art.image} alt={art.title} />
                      <div className="sold-overlay">SOLD</div>
                    </div>
                    <div className="artwork-card-content">
                      <h3 className="artwork-title">{art.title}</h3>
                      <p className="artwork-artist sold-price">Sold for ${art.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <p className="empty-state">No sold works to display yet.</p>}
          </section>

          {/* COURSES */}
          <section id="courses" className="profile-section">
            <h2 className="section-title">Courses Taught ({courses?.length || 0})</h2>
            {courses?.length > 0 ? (
              <div className="courses-gallery">
                <div className="courses-gallery-inner">
                  {courses.map(course => (
                    <div className="course-card-image-wrapper" key={course._id}>
                      <Link to={`/courses/${course._id}`}>
                        <img src={course.coverImage} alt={course.title} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="empty-state">This artist has no courses available yet.</p>}
          </section>
          
          {/* REVIEWS - This can be its own section if you want, or integrated elsewhere */}

        </main>
      </div>
    </div>
  );
};

export default ArtistProfilePage;