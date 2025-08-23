// src/pages/BadgeSystemPage.jsx

import React from 'react';
import './BadgeSystemPage.css'; // The existing CSS will work perfectly

const BadgeSystemPage = () => {
  return (
    <div className="badge-system-page section">
      <div className="container">
        {/* --- MAIN HEADER --- */}
        <div className="page-header text-center">
          <h1 className="page-title">The KalaKosh Badge System</h1>
          <p className="page-subtitle">A Mark of Authenticity and Achievement</p>
        </div>

        {/* --- NEW "WHY IT MATTERS" SECTION --- */}
        <div className="why-it-matters-section">
          <div className="why-card">
            <h3>For Buyers: A Symbol of Trust</h3>
            <p>When you see a badge on an artist's profile, you're looking at a verified member of our community. The badge system serves as a key part of our verification process. Earning a badge means an artist has not only met our quality standards but has also consistently contributed to the platform. It's a clear and trusted signal of their dedication and authenticity.</p>
          </div>
          <div className="why-card">
            <h3>For Artists: A Path to Recognition</h3>
            <p>We believe in celebrating your journey. This system provides a clear roadmap for growth. By listing artworks, sharing stories, and teaching your craft, you can earn badges that showcase your expertise and unlock greater visibility on KalaKosh.</p>
          </div>
        </div>

        <h2 className="paths-main-title">The Three Paths to Mastery</h2>

        <div className="paths-grid">
          {/* --- PATH 1: CREATOR --- */}
          <div className="path-card">
            <div className="path-card-header">
              <h2 className="path-title">The Creator's Path</h2>
              <p className="path-description">Honors an artist's portfolio and dedication to their craft.</p>
            </div>
            <div className="badge-levels">
              <div className="badge-level gold">
                <h3>Master of the Craft</h3>
                <p><strong>Criteria:</strong> List 9+ artworks.</p>
              </div>
              <div className="badge-level silver">
                <h3>Established Creator</h3>
                <p><strong>Criteria:</strong> List 6 artworks.</p>
              </div>
              <div className="badge-level bronze">
                <h3>Rising Artisan</h3>
                <p><strong>Criteria:</strong> List 3 artworks.</p>
              </div>
            </div>
          </div>

          {/* --- PATH 2: STORYTELLER --- */}
          <div className="path-card">
            <div className="path-card-header">
              <h2 className="path-title">The Storyteller's Path</h2>
              <p className="path-description">Honors an artist's role in sharing cultural narratives via blog posts.</p>
            </div>
            <div className="badge-levels">
              <div className="badge-level gold">
                <h3>Tradition Bearer</h3>
                <p><strong>Criteria:</strong> Publish 9+ blog posts.</p>
              </div>
              <div className="badge-level silver">
                <h3>Heritage Chronicler</h3>
                <p><strong>Criteria:</strong> Publish 6 blog posts.</p>
              </div>
              <div className="badge-level bronze">
                <h3>Cultural Voice</h3>
                <p><strong>Criteria:</strong> Publish 3 blog posts.</p>
              </div>
            </div>
          </div>

          {/* --- PATH 3: EDUCATOR --- */}
          <div className="path-card">
            <div className="path-card-header">
              <h2 className="path-title">The Educator's Path</h2>
              <p className="path-description">Honors an artist's commitment to teaching their skills via courses.</p>
            </div>
            <div className="badge-levels">
              <div className="badge-level gold">
                <h3>Master Educator</h3>
                <p><strong>Criteria:</strong> Publish 9+ courses.</p>
              </div>
              <div className="badge-level silver">
                <h3>Proven Instructor</h3>
                <p><strong>Criteria:</strong> Publish 6 courses.</p>
              </div>
              <div className="badge-level bronze">
                <h3>Community Guide</h3>
                <p><strong>Criteria:</strong> Publish 3 courses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystemPage;