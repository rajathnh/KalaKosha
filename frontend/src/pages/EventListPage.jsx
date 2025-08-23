// src/pages/EventListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './CourseListPage.css'; // Reusing course list styles for speed

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/events');
        setEvents(response.data.events);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="container section"><h2>Loading Events...</h2></div>;

  return (
    <div className="course-list-page section">
      <div className="container">
        <h1 className="page-title">Upcoming Events</h1>
        <p className="page-subtitle">Join live workshops, talks, and exhibitions hosted by our artists.</p>
        
        {events.length > 0 ? (
          <div className="course-grid">
            {events.map(event => (
              <Link to={`/events/${event._id}`} key={event._id} className="course-card">
                <div className="course-card-image">
                  <img src={event.eventImage} alt={event.title} />
                  <span className="course-card-difficulty">{event.eventType}</span>
                </div>
                <div className="course-card-info">
                  <h3>{event.title}</h3>
                  <p className="course-artist">
                    Hosted by {event.host.name} on {new Date(event.startTime).toLocaleDateString()}
                  </p>
                  <div className="course-card-footer">
                    <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="course-card-price">{event.price > 0 ? `$${event.price}` : 'Free'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center">No upcoming events scheduled. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default EventListPage;