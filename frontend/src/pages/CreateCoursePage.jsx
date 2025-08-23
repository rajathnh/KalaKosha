// src/pages/CreateCoursePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './FormPage.css'; // Reusing our form styles

const CreateCoursePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    artForm: '',
    difficulty: 'Beginner', // Default value
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImageFile) {
      setError('Please upload a cover image for the course.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('coverImage', coverImageFile);

    try {
      await apiClient.post('/courses', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create course.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="form-container">
        <h2>Add a New Course</h2>
        <p>Share your knowledge and passion with the community.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input type="text" name="title" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Course Description</label>
            <textarea name="description" rows="5" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input type="number" name="price" onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="artForm">Art Form Taught</label>
            <input type="text" name="artForm" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input type="file" name="coverImage" onChange={handleFileChange} required accept="image/*" />
          </div>
          
          {error && <p className="form-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;