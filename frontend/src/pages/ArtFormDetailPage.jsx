import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artForms } from '../data/artForms';
import './Discover.css';

const ArtFormDetailPage = () => {
  const { artFormId } = useParams();
  const art = artForms.find((form) => form.id === artFormId);

  // Safely initialize state
  const [selectedImage, setSelectedImage] = useState(art ? art.galleryImages[0] : '');

  if (!art) {
    return (
      <div className="container section text-center">
        <h2>Art Form Not Found</h2>
        <Link to="/discover" className="btn btn-primary">Back to Discover</Link>
      </div>
    );
  }

  return (
    <div className="art-detail-page section">
      <div className="container">
        <h1 className="art-detail-title">{art.name}</h1>
        <p className="art-detail-region">{art.region}</p>
        
        <div className="art-detail-content">
          <div className="art-detail-gallery">
            <div className="art-detail-main-image">
              <img src={selectedImage} alt={`${art.name} - main view`} />
            </div>
            <div className="art-detail-thumbnails">
              {art.galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`art-detail-thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${art.name} - thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="art-detail-text">
            <h2>Styles & Characteristics</h2>
            <div dangerouslySetInnerHTML={{ __html: art.details.stylesAndCharacteristics }} />

            <h2>Themes & Symbolism</h2>
            <div dangerouslySetInnerHTML={{ __html: art.details.themesAndSymbolism }} />
            
            <h2>Technique & Style</h2>
            <div dangerouslySetInnerHTML={{ __html: art.details.techniqueAndStyle }} />
          </div>
        </div>
        
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/discover" className="btn btn-outline">← Back to All Arts</Link>
        </div>
      </div>
    </div>
  );
};

export default ArtFormDetailPage;
