// src/pages/CreateBlogPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './FormPage.css'; // Reusing our form styles

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '', // Will be sent as a comma-separated string
  });
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFeaturedImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!featuredImageFile) {
      setError('Please upload a featured image for the blog post.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('featuredImage', featuredImageFile);

    try {
      // The API endpoint for blogs is '/api/v1/blog'
      await apiClient.post('/blog', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create blog post.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="form-container">
        <h2>Write a New Blog Post</h2>
        <p>Share your stories, insights, and techniques with the community.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input type="text" name="title" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea name="content" rows="10" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input type="text" name="tags" placeholder="e.g., Warli, Painting Techniques, History" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="featuredImage">Featured Image</label>
            <input type="file" name="featuredImage" onChange={handleFileChange} required accept="image/*" />
          </div>
          
          {error && <p className="form-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;