import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import '../../pages/ArtworkListPage.css'; // Reusing styles

const MyCoursesPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/courses/my-courses')
      .then(res => setCourses(res.data.courses))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your courses...</p>;

  return (
    <div className="my-courses-panel">
      <div className="panel-header">
        <h2>My Courses</h2>
        <Link to="/courses/create" className="btn btn-primary">+ Add New Course</Link>
      </div>
      {courses.length > 0 ? (
        <div className="artwork-grid">
          {courses.map((course) => (
            <div key={course._id} className="artwork-card">
              <div className="artwork-card-image"><img src={course.coverImage} alt={course.title} /></div>
              <div className="artwork-card-info">
                <h3>{course.title}</h3>
                <p>Difficulty: <strong>{course.difficulty}</strong></p>
              </div>
            </div>
          ))}
        </div>
      ) : <p>You haven't created any courses yet.</p>}
    </div>
  );
};
export default MyCoursesPanel;