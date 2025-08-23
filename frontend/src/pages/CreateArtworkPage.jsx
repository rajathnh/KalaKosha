// src/pages/CreateArtworkPage.jsx
import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './FormPage.css'; // We'll create a reusable CSS file for all forms

const CreateArtworkPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    artForm: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please upload an image for the artwork.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('image', imageFile);

    try {
      await apiClient.post('/artworks', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create artwork.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="form-container">
        <h2>Add a New Artwork</h2>
        <p>Showcase your latest creation to the world.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" rows="5" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input type="number" name="price" onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="artForm">Art Form (e.g., Warli, Madhubani)</label>
            <input type="text" name="artForm" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Artwork Image</label>
            <input type="file" name="image" onChange={handleFileChange} required accept="image/*" />
          </div>
          
          {error && <p className="form-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArtworkPage;