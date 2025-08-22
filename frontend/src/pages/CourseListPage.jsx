// src/pages/CourseListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './CourseListPage.css'; // We'll create this

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  // We can add state for filters (difficulty, artForm) later

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Using your powerful API with sorting
        const response = await apiClient.get('/courses?sort=latest');
        setCourses(response.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="container section"><h2>Loading Courses...</h2></div>;

  return (
    <div className="course-list-page section">
      <div className="container">
        <h1 className="page-title">Explore Our Courses</h1>
        <p className="page-subtitle">Learn traditional art forms directly from master artists.</p>
        
        {/* We can add filter controls here in the future */}

        <div className="course-grid">
          {courses.map(course => (
            <Link to={`/courses/${course._id}`} key={course._id} className="course-card">
              <div className="course-card-image">
                <img src={course.coverImage} alt={course.title} />
                <span className="course-card-difficulty">{course.difficulty}</span>
              </div>
              <div className="course-card-info">
                <h3>{course.title}</h3>
                <p className="course-artist">By {course.artist.name}</p>
                <div className="course-card-footer">
                  <span className="course-card-rating">
                    ⭐ {course.averageRating.toFixed(1)} 
                    ({course.numOfReviews} reviews)
                  </span>
                  <span className="course-card-price">${course.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;