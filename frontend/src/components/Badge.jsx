// src/components/Badge.jsx
import React from 'react';
import './Badge.css'; // We'll create this CSS file

// Helper object to store badge properties
const badgeData = {
  artwork: {
  1: { label: 'Rising Artisan', color: 'linear-gradient(90deg, #e2a76f 0%, #b87333 100%)', title: 'Bronze Creator: 3+ Artworks' },
  2: { label: 'Established Creator', color: 'linear-gradient(90deg, #e3e3e3 0%, #bfc9ca 100%)', title: 'Silver Creator: 6+ Artworks' },
  3: { label: 'Master of the Craft', color: 'linear-gradient(90deg, #ffe066 0%, #ffd700 50%, #f7b600 100%)', title: 'Gold Creator: 9+ Artworks' },
  },
  course: {
  1: { label: 'Community Guide', color: 'linear-gradient(90deg, #e2a76f 0%, #b87333 100%)', title: 'Bronze Educator: 3+ Courses' },
  2: { label: 'Proven Instructor', color: 'linear-gradient(90deg, #e3e3e3 0%, #bfc9ca 100%)', title: 'Silver Educator: 6+ Courses' },
  3: { label: 'Master Educator', color: 'linear-gradient(90deg, #ffe066 0%, #ffd700 50%, #f7b600 100%)', title: 'Gold Educator: 9+ Courses' },
  },
  blog: {
  1: { label: 'Cultural Voice', color: 'linear-gradient(90deg, #e2a76f 0%, #b87333 100%)', title: 'Bronze Storyteller: 3+ Blogs' },
  2: { label: 'Heritage Chronicler', color: 'linear-gradient(90deg, #e3e3e3 0%, #bfc9ca 100%)', title: 'Silver Storyteller: 6+ Blogs' },
  3: { label: 'Tradition Bearer', color: 'linear-gradient(90deg, #ffe066 0%, #ffd700 50%, #f7b600 100%)', title: 'Gold Storyteller: 9+ Blogs' },
  },
};

const Badge = ({ type, tier }) => {
  // Don't render anything if there's no badge (tier 0)
  if (!tier || tier === 0) {
    return null;
  }

  const { label, color, title } = badgeData[type][tier];

  // If color is a gradient, use backgroundImage instead of backgroundColor
  const style = color.startsWith('linear-gradient')
    ? { backgroundImage: color }
    : { backgroundColor: color };

  return (
    <span className="artist-badge" style={style} title={title}>
      {label}
    </span>
  );
};

export default Badge;