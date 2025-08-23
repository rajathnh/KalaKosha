import React from 'react'
import './Team.css'

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rajath N H",
      role: "Backend Developer",
      avatar: "../../public/team/Rajath.jpg"
    },
    {
      id: 2,
      name: "Prajnan Vaidya",
      role: "Frontend Developer",
      avatar: "../../public/team/Prajnan.jpg"
    },
    {
      id: 3,
      name: "Preeti Bhat",
      role: "Assistant Backend Developer",
      avatar: "../../public/team/Preeti.jpg"
    },
    {
      id: 4,
      name: "Yashaswini D B",
      role: "Database Architect",
      avatar: "../../public/team/Yashaswini.jpg"
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
