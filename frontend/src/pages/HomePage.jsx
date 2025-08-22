// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero';
import Explore from '../components/Explore';
import Testimonials from '../components/Testimonials';
import Team from '../components/Team';
import Contact from '../components/Contact';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Explore />
      <Testimonials />
      <Team />
      <Contact />
    </>
  );
};

export default HomePage;