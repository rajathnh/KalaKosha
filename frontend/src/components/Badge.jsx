// src/components/Badge.jsx
import React from 'react';
import './Badge.css'; // We'll create this CSS file

// Helper object to store badge properties
const badgeData = {
  artwork: {
    1: { label: 'Creator I', color: '#cd7f32', title: 'Bronze Creator: 3+ Artworks' },
    2: { label: 'Creator II', color: '#c0c0c0', title: 'Silver Creator: 6+ Artworks' },
    3: { label: 'Creator III', color: '#ffd700', title: 'Gold Creator: 9+ Artworks' },
  },
  course: {
    1: { label: 'Educator I', color: '#cd7f32', title: 'Bronze Educator: 3+ Courses' },
    2: { label: 'Educator II', color: '#c0c0c0', title: 'Silver Educator: 6+ Courses' },
    3: { label: 'Educator III', color: '#ffd700', title: 'Gold Educator: 9+ Courses' },
  },
  blog: {
    1: { label: 'Storyteller I', color: '#cd7f32', title: 'Bronze Storyteller: 3+ Blogs' },
    2: { label: 'Storyteller II', color: '#c0c0c0', title: 'Silver Storyteller: 6+ Blogs' },
    3: { label: 'Storyteller III', color: '#ffd700', title: 'Gold Storyteller: 9+ Blogs' },
  },
};

const Badge = ({ type, tier }) => {
  // Don't render anything if there's no badge (tier 0)
  if (!tier || tier === 0) {
    return null;
  }

  const { label, color, title } = badgeData[type][tier];

  return (
    <span className="artist-badge" style={{ backgroundColor: color }} title={title}>
      {label}
    </span>
  );
};

export default Badge;