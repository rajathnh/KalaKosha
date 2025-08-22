import React, { useState } from 'react'
import './Testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Anil Sharma",
      role: "Folk Artist, India",
      quote: "KalaKosha has transformed my art into a thriving business, connecting me with buyers who appreciate my work.",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%23b68d40'/><path d='M 30 70 Q 50 90 70 70' fill='%23b68d40'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>AS</text></svg>"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Art Collector, Mumbai",
      quote: "The platform showcases authentic Indian folk art like never before. I've discovered amazing artists and unique pieces.",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%23a66321'/><path d='M 30 70 Q 50 90 70 70' fill='%23a66321'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>PP</text></svg>"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "Cultural Heritage Expert, Delhi",
      quote: "KalaKosha is preserving our cultural heritage by giving traditional artists a modern platform to showcase their work.",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%236b3e1d'/><path d='M 30 70 Q 50 90 70 70' fill='%236b3e1d'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>RK</text></svg>"
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
