// src/pages/CreateEventPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './FormPage.css'; // Reusing our existing form styles

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    eventType: 'Talk', // Default value
    price: '0',
    meetingLink: '',
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEventImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventImageFile) {
      setError('Please upload an image for the event.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const submissionData = new FormData();
    // Append all text fields from the form state
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    // Append the image file
    submissionData.append('eventImage', eventImageFile);

    try {
      await apiClient.post('/events', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // On success, redirect the artist to their events dashboard
      navigate('/dashboard'); // Or you could have a dedicated state for the events panel
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create the event.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="form-container">
        <h2>Create a New Event</h2>
        <p>Host a workshop, talk, or exhibition for the community.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input type="text" name="title" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Event Description</label>
            <textarea name="description" rows="5" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Date and Time</label>
            <input type="datetime-local" name="startTime" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange}>
              <option value="Workshop">Workshop</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Talk">Talk</option>
              <option value="Q&A">Q&A Session</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($) - (Enter 0 for free events)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="meetingLink">Virtual Meeting Link (e.g., Zoom, Google Meet)</label>
            <input type="url" name="meetingLink" placeholder="https://..." onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="eventImage">Event Image</label>
            <input type="file" name="eventImage" onChange={handleFileChange} required accept="image/*" />
          </div>
          
          {error && <p className="form-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;