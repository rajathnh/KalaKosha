import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import './Explore.css';

const Explore = () => {
  const exploreCards = [
    { id: 1, title: "Marketplace for Art Enthusiasts and Creators", image: '/explore1.jpg' },
    { id: 2, title: "Learn About Indian Folk Art Traditions", image: '/explore2.jpg' },
    { id: 3, title: "Showcase Your Art to a Wider Audience", image: '/explore3.jpg' }
  ];

  return (
    <section id="explore" className="explore section">
      <div className="container">
        <div className="explore-header text-center">
          {/* ...your header content... */}
        </div>
        
        <div className="explore-cards">
          {exploreCards.map((card) => {
            // If it's the second card, wrap it in a Link
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
            // Render other cards normally
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