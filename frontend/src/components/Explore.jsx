import React from 'react'
import './Explore.css'

const Explore = () => {
  const exploreCards = [
    {
      id: 1,
      title: "Marketplace for Art Enthusiasts and Creators",
      image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23f0f0f0'/><circle cx='150' cy='100' r='60' fill='%23d2691e' opacity='0.8'/><circle cx='120' cy='80' r='20' fill='%23b68d40'/><circle cx='180' cy='120' r='25' fill='%23a66321'/><text x='150' y='190' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'>Traditional Puppets</text></svg>"
    },
    {
      id: 2,
      title: "Learn About Indian Folk Art Traditions",
      image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23f0f0f0'/><ellipse cx='150' cy='100' rx='80' ry='40' fill='%23ff4500' opacity='0.8'/><circle cx='150' cy='80' r='15' fill='%23ffff00'/><circle cx='150' cy='120' r='10' fill='%23ff8c00'/><text x='150' y='190' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'>Ritual Fire</text></svg>"
    },
    {
      id: 3,
      title: "Showcase Your Art to a Wider Audience",
      image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23f0f0f0'/><circle cx='120' cy='100' r='30' fill='%23ffff00' opacity='0.8'/><circle cx='180' cy='100' r='30' fill='%23ffffff' opacity='0.8'/><circle cx='150' cy='70' r='15' fill='%23ff69b4'/><text x='150' y='190' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'>Dance Performance</text></svg>"
    }
  ]

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
          {exploreCards.map((card) => (
            <div key={card.id} className="explore-card">
              <div className="explore-card-image">
                <img src={card.image} alt={card.title} />
              </div>
              <h3 className="explore-card-title">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Explore
