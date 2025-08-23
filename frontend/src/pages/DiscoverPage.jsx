import React from 'react';
import { Link } from 'react-router-dom';
import { artForms } from '../data/artForms';
import './Discover.css'; 

const DiscoverPage = () => {
  return (
    <div className="discover-page section">
      <div className="container">
        <div className="text-center">
          <h2 className="discover-title">Discover Indian Art Forms</h2>
          <p className="discover-description">
            Explore the rich tapestry of India's folk and traditional art. Each form tells a unique story of its culture, history, and people.
          </p>
        </div>
        <div className="art-forms-grid">
          {artForms.map((art) => (
            <Link to={`/discover/${art.id}`} key={art.id} className="art-card">
              <img src={art.thumbnail} alt={art.name} className="art-card-img" />
              <div className="art-card-overlay">
                <h3 className="art-card-title">{art.name}</h3>
                <p className="art-card-region">{art.region}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;