import React from 'react'
import './Team.css'

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rajath N H",
      role: "Backend Developer",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%23b68d40'/><path d='M 30 70 Q 50 90 70 70' fill='%23b68d40'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>RN</text></svg>"
    },
    {
      id: 2,
      name: "Prajnan Vaidya",
      role: "Frontend Developer",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%23a66321'/><path d='M 30 70 Q 50 90 70 70' fill='%23a66321'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>PV</text></svg>"
    },
    {
      id: 3,
      name: "Preeti Bhat",
      role: "Assistant Backend Developer",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%236b3e1d'/><path d='M 30 70 Q 50 90 70 70' fill='%236b3e1d'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>PB</text></svg>"
    },
    {
      id: 4,
      name: "Yashashwini D B",
      role: "Database Architect",
      avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><circle cx='50' cy='40' r='20' fill='%238b4513'/><path d='M 30 70 Q 50 90 70 70' fill='%238b4513'/><text x='50' y='95' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'>YD</text></svg>"
    }
  ]

  return (
    <section className="team section">
      <div className="container">
        <div className="team-header text-center">
          <h3 className="team-subtitle">Meet</h3>
          <h2 className="team-title">Our Team</h2>
          <p className="team-description">
            Dedicated to preserving Indian folk art and culture.
          </p>
        </div>
        
        <div className="team-members">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member">
              <div className="team-member-avatar">
                <img src={member.avatar} alt={member.name} />
              </div>
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
