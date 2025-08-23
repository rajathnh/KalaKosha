import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
// You might want a different style for blogs (list vs. grid)
import '../../pages/BlogListPage'; 

const MyBlogsPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/blog/my-blogs')
      .then(res => setBlogs(res.data.blogPosts))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your blog posts...</p>;

  return (
    <div className="my-blogs-panel">
      <div className="panel-header">
        <h2>My Blog Posts</h2>
        <Link to="/blog/create" className="btn btn-primary">+ Write New Post</Link>
      </div>
      {blogs.length > 0 ? (
        <div className="blog-list">
          {blogs.map((post) => (
            <div key={post._id} className="blog-item-row">
              <h3>{post.title}</h3>
              <p>Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
              {/* Add Edit/Delete buttons here */}
            </div>
          ))}
        </div>
      ) : <p>You haven't written any blog posts yet.</p>}
    </div>
  );
};
export default MyBlogsPanel;