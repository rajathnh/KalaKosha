import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-left">
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-description">
              Have questions about Indian folk art or want to collaborate? We'd love to hear from you.
            </p>
            
            <div className="contact-details">
              <div className="contact-item ci-1">
                <div className="contact-icon">📧</div>
                <div className="contact-info">
                  <h4>Email</h4>
                  <p>info@kalakosha.com</p>
                </div>
              </div>
              
              <div className="contact-item ci-2">
                <div className="contact-icon">📞</div>
                <div className="contact-info">
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">🏢</div>
                <div className="contact-info">
                  <h4>Office Address</h4>
                  <p>123 Heritage Lane, Art District<br />Mumbai, Maharashtra 400001<br />India</p>
                </div>
              </div>
            </div>
            
            <div className="contact-actions">
              <button className="btn btn-primary">Send Message</button>
              <button className="btn btn-outline">Schedule Call</button>
            </div>
          </div>
          
          <div className="contact-right">
            <div className="contact-image">
              <img 
                src='../../public/contact.jpg'
                alt="Indian Heritage Sculpture"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
