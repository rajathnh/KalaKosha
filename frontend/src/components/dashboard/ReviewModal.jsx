// src/components/ReviewModal.jsx
import React, { useState } from 'react';
import apiClient from '../api/axios';
// We can reuse the same modal CSS!
import './CommissionFormModal.css';

const ReviewModal = ({ isOpen, onClose, commission, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await apiClient.post('/commission-reviews', {
        commissionId: commission._id,
        rating: Number(rating),
        comment,
      });
      onReviewSubmit(); // Tell the parent to refresh and close
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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
          {error && <p style={{color: 'red'}}>{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;