import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Explore.css';

const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const exploreCards = [
    { id: 1, title: "Marketplace for Art Enthusiasts and Creators", image: '/explore1.jpg' },
    { id: 2, title: "Learn About Indian Folk Art Traditions", image: '/explore2.jpg' },
    { id: 3, title: "Showcase Your Art to a Wider Audience", image: '/explore3.jpg' }
  ];

  return (
    <section id="explore" className="explore section">
      <div className="container">
        <div className="explore-header text-center">
          <h3 className="explore-subtitle">Explore</h3>
          <h2 className="explore-title">Unveil the Beauty of Indian Folk Art</h2>
          <p className="explore-description">
            Discover a treasure trove of unique artworks that reflect the rich heritage of India. Each piece tells a story, connecting you to the vibrant culture and traditions of local artisans.
          </p>
        </div>
        
        <div className="explore-cards">
          {exploreCards.map((card) => {
            if (card.id === 2) {
              return (
                <Link to="/discover" key={card.id} className="explore-card-link">
                  <div className="explore-card">
                    <div className="explore-card-image">
                      <img src={card.image} alt={card.title} />
                    </div>
                    <h3 className="explore-card-title">{card.title}</h3>
                  </div>
                </Link>
              );
            }

            if (card.id === 1) {
              return (
                <Link to="/artworks" key={card.id} className="explore-card-link">
                  <div className="explore-card">
                    <div className="explore-card-image">
                      <img src={card.image} alt={card.title} />
                    </div>
                    <h3 className="explore-card-title">{card.title}</h3>
                  </div>
                </Link>
              );
            }

            // Card 3: Showcase Your Art to a Wider Audience
            if (card.id === 3) {
              return (
                <div key={card.id} className="explore-card explore-card-link" style={{ cursor: 'pointer' }}
                  onClick={() => {
                    // Check if user is an artist (adjust property as per your backend, e.g. user.type === 'artist' or user.isArtist)
                    if (user && (user.type === 'artist' || user.isArtist)) {
                      navigate(`/artist/${user._id}`);
                    } else {
                      window.alert('To showcase your art, please create an account as an artist.');
                    }
                  }}>
                  <div className="explore-card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                  <h3 className="explore-card-title">{card.title}</h3>
                </div>
              );
            }

            return (
              <div key={card.id} className="explore-card">
                <div className="explore-card-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <h3 className="explore-card-title">{card.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Explore;