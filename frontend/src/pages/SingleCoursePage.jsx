import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import './SingleArtworkPage.css'; // Reusing the CSS

const SingleCoursePage = () => {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data state
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Status state (for enrollment and reviews)
  const [enrollmentStatus, setEnrollmentStatus] = useState({ hasPurchased: false, hasReviewed: false });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const coursePromise = apiClient.get(`/courses/${courseId}`);
      const reviewsPromise = apiClient.get(`/reviews/Course/${courseId}`);
      const promises = [coursePromise, reviewsPromise];

      if (user) {
        // Use our existing endpoint to check enrollment (purchase) status
        const statusPromise = apiClient.get(`/orders/status/Course/${courseId}`);
        promises.push(statusPromise);
      }
      
      const responses = await Promise.all(promises);
      
      setCourse(responses[0].data.course);
      setReviews(responses[1].data.reviews);
      
      if (user) {
        setEnrollmentStatus(responses[2].data);
      }
    } catch (err) {
      setError('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleEnrollNow = () => {
    const checkoutUrl = `/checkout/course/${courseId}`;
    if (!user) {
      navigate('/login', { state: { from: { pathname: checkoutUrl } } });
    } else {
      navigate(checkoutUrl);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    await fetchData();
  };

  if (loading) return <div className="container section"><h2>Loading Course...</h2></div>;
  if (error) return <div className="container section"><p className="error-message">{error}</p></div>;
  if (!course) return null;

  const canLeaveReview = user && enrollmentStatus.hasPurchased && !enrollmentStatus.hasReviewed;

  return (
    <div className="single-artwork-page section">
      <div className="container">
        <div className="artwork-main-layout">
          <div className="artwork-image-container">
            <img src={course.coverImage} alt={course.title} />
          </div>
          <div className="artwork-details-container">
            <h1>{course.title}</h1>
            <Link to={`/artists/${course.artist._id}`} className="artist-link">
              By {course.artist.name}
            </Link>
            <p className="artwork-price">${course.price}</p>
            <p className="artwork-description">{course.description}</p>
            <div className="artwork-meta">
              <span><strong>Art Form:</strong> {course.artForm}</span>
              <span><strong>Difficulty:</strong> {course.difficulty}</span>
              <span><strong>Rating:</strong> ⭐ {course.averageRating.toFixed(1)} ({course.numOfReviews} reviews)</span>
            </div>

            {/* --- THIS IS THE KEY LOGICAL FIX --- */}
            {enrollmentStatus.hasPurchased ? (
              <p className="enrolled-notice"><strong>You are enrolled in this course.</strong></p>
            ) : (
              <button onClick={handleEnrollNow} className="btn btn-primary buy-button">
                Enroll Now
              </button>
            )}
            {/* --- END OF FIX --- */}

          </div>
        </div>

        <div className="artwork-reviews-section">
          <h2>Reviews ({reviews.length})</h2>

          {/* Logic for showing the review button */}
          {canLeaveReview && !showReviewForm && (
            <div className="review-prompt">
              <button onClick={() => setShowReviewForm(true)} className="btn btn-outline">
                Leave a Review
              </button>
            </div>
          )}

          {/* Logic for showing the review form */}
          {canLeaveReview && showReviewForm && (
            <ReviewForm 
              productId={courseId} 
              productType="Course"
              onReviewSubmit={handleReviewSubmitted}
            />
          )}

          {/* Logic for showing the "already reviewed" message */}
          {user && enrollmentStatus.hasReviewed && (
            <div className="review-prompt">
              <p><strong>Thank you! You've already reviewed this course.</strong></p>
            </div>
          )}

          {/* The review list itself */}
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <h4>{review.title}</h4>
                  <p className="review-rating">Rating: {review.rating} / 5</p>
                  <p className="review-comment">"{review.comment}"</p>
                  <p className="review-author">- {review.user.name}</p>
                </div>
              ))}
            </div>
          ) : (
            // This is now the "else" part of the condition.
            // It will only show if reviews.length is 0.
            <p>No reviews yet for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;