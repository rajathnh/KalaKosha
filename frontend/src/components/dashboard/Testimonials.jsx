import React, { useState } from 'react'
import './Testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Anil Sharma",
      role: "Folk Artist, India",
      quote: "KalaKosha has transformed my art into a thriving business, connecting me with buyers who appreciate my work.",
      avatar: '../../public/anil.jpg'
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Art Collector, Mumbai",
      quote: "The platform showcases authentic Indian folk art like never before. I've discovered amazing artists and unique pieces.",
      avatar: '../../public/priya.jpg'
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "Cultural Heritage Expert, Delhi",
      quote: "KalaKosha is preserving our cultural heritage by giving traditional artists a modern platform to showcase their work.",
      avatar: '../../public/rajesh.jpg'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="testimonials-content">
          <button 
            className="testimonial-nav testimonial-nav-prev" 
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          
          <div className="testimonial-main">
            <div className="testimonial-avatar">
              <img src={currentTestimonial.avatar} alt={currentTestimonial.name} />
            </div>
            <h3 className="testimonial-name">{currentTestimonial.name}</h3>
            <p className="testimonial-role">{currentTestimonial.role}</p>
            <blockquote className="testimonial-quote">
              "{currentTestimonial.quote}"
            </blockquote>
          </div>
          
          <button 
            className="testimonial-nav testimonial-nav-next" 
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
