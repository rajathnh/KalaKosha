// src/pages/BlogListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './BlogListPage.css'; // We'll create this

const BlogListPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await apiClient.get('/blog');
        setBlogPosts(response.data.blogPosts);
      } catch (err) {
        console.error("Failed to fetch blog posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  if (loading) return <div className="container section"><h2>Loading Blog...</h2></div>;

  return (
    <div className="blog-list-page section">
      <div className="container">
        <header className="blog-header">
          <h1>From the Artists' Desk</h1>
          <p>Stories, techniques, and inspiration from our community of artists.</p>
        </header>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <Link to={`/blog/${post._id}`} key={post._id} className="blog-card">
              <div className="blog-card-image">
                <img src={post.featuredImage} alt={post.title} />
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="author">By {post.artist.name}</span>
                  <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                {/* We can add a short excerpt later if the API provides it */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;