import React from 'react'
import './Explore.css'

const Explore = () => {
  const exploreCards = [
    {
      id: 1,
      title: "Marketplace for Art Enthusiasts and Creators",
      image: '../../public/explore1.jpg'
    },
    {
      id: 2,
      title: "Learn About Indian Folk Art Traditions",
      image: '../../public/explore2.jpg'
    },
    {
      id: 3,
      title: "Showcase Your Art to a Wider Audience",
      image: '../../public/explore3.jpg'
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
