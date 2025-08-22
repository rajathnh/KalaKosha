import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Explore from './components/Explore'
import Testimonials from './components/Testimonials'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Explore />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
