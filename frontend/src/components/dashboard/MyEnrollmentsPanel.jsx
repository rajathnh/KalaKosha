// src/components/dashboard/MyEnrollmentsPanel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import '../../pages/ArtworkListPage.css'; // Reusing gallery styles

const MyEnrollmentsPanel = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await apiClient.get('/orders/my-collection');
        // Filter the results to only include courses
        const courses = response.data.items.filter(item => item.onModel === 'Course');
        setEnrolledCourses(courses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  if (loading) return <p>Loading your enrollments...</p>;

  return (
    <div className="my-enrollments-panel">
      <h2>My Enrollments</h2>
      <p>All the courses you are currently enrolled in.</p>
      <hr className='message1'/>
      {enrolledCourses.length > 0 ? (
        <div className="artwork-grid"> {/* Reusing the same grid style */}
          {enrolledCourses.map(({ product }) => (
            <Link to={`/courses/${product._id}`} key={product._id} className="artwork-card">
              <div className="artwork-card-image"><img src={product.coverImage} alt={product.title} /></div>
              <div className="artwork-card-info">
                <h3>{product.title}</h3>
                <p>By {product.artist.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>You are not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default MyEnrollmentsPanel;