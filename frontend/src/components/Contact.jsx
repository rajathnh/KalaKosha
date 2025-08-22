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
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-info">
                  <h4>Email</h4>
                  <p>info@kalakosha.com</p>
                </div>
              </div>
              
              <div className="contact-item">
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
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect width='400' height='500' fill='%23f0f0f0'/><rect x='100' y='100' width='200' height='300' fill='%23d2691e' opacity='0.8'/><circle cx='200' cy='150' r='40' fill='%23b68d40'/><rect x='120' y='200' width='160' height='80' fill='%23a66321'/><rect x='140' y='300' width='120' height='60' fill='%236b3e1d'/><text x='200' y='480' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'>Heritage Sculpture</text></svg>" 
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
