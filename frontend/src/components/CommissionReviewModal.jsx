// src/components/CommissionReviewModal.jsx
import React, { useState } from 'react';
import apiClient from '../api/axios';
import './CommissionFormModal.css'; // Reusing modal styles

const CommissionReviewModal = ({ isOpen, onClose, commission, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Don't render the component if it's not supposed to be open
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear previous errors

    try {
      // Make the API call to create the review
      await apiClient.post('/commission-reviews', {
        commissionId: commission._id,
        rating: Number(rating),
        comment,
      });

      // --- THIS IS THE CRUCIAL FIX ---
      // On success, call the function passed from the parent component.
      // This will trigger the data refresh in ChatPage.
      onReviewSubmit(); 
      
      // Also, reset the form fields for the next time the modal opens
      setComment('');
      setRating(5);

    } catch (err) {
      // If the API call fails, show the error message
      setError(err.response?.data?.msg || 'Failed to submit review.');
    } finally {
      // This will run whether the submission succeeded or failed
      setIsSubmitting(false);
    }
  };
  
  // A wrapper for the onClose prop to also clear the error state
  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reviewing "{commission.title}"</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea 
                rows="5" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                required 
            />
          </div>

          {/* Display the error message right above the buttons */}
          {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionReviewModal;