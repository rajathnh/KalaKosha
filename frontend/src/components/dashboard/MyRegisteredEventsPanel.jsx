import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import '../../pages/ArtworkListPage.css'; // Reusing the gallery card styles
import { Link } from 'react-router-dom';
const MyRegisteredEventsPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/events/my-registered');
        setEvents(response.data.events || []);
      } catch (err) {
        console.error("Failed to fetch registered events", err);
        setError("Could not load your event registrations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegisteredEvents();
  }, []);

  if (loading) {
    return <p>Loading your registered events...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="my-registered-events-panel">
      <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
        <h2>My Registered Events</h2>
        <p>Here are your upcoming events. You will be notified before they start.</p>
      </div>
      <hr style={{ marginBottom: '1.5rem' }}/>
      {events.length > 0 ? (
        <div className="artwork-grid">
          {events.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id} className="artwork-card">
              <div className="artwork-card-image">
                <img src={event.eventImage} alt={event.title} />
              </div>
              <div className="artwork-card-info">
                <h3>{event.title}</h3>
                <p>Hosted by <strong>{event.host.name}</strong></p>
                <p>Date: <strong>{new Date(event.startTime).toLocaleDateString()}</strong></p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>You are not registered for any upcoming events.</p>
      )}
    </div>
  );
};

export default MyRegisteredEventsPanel;