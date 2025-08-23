// src/pages/SingleBlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './SingleBlogPostPage.css'; // We'll create this

// A simple component for the comment form
const CommentForm = ({ postId, onCommentPosted }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            await apiClient.post('/comments', { postId, content });
            setContent('');
            onCommentPosted(); // Tell the parent to refresh comments
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <h4>Leave a Comment</h4>
            <textarea
                rows="4"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};


const SingleBlogPostPage = () => {
  const { id: postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const postPromise = apiClient.get(`/blog/${postId}`);
      const commentsPromise = apiClient.get(`/comments/post/${postId}`);
      
      const [postResponse, commentsResponse] = await Promise.all([postPromise, commentsPromise]);

      setPost(postResponse.data.blogPost);
      setComments(commentsResponse.data.comments);
    } catch (err) {
      setError('Failed to load the blog post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
        fetchPostAndComments();
    }
  }, [postId]);

  if (loading) return <div className="container section"><h2>Loading Post...</h2></div>;
  if (error) return <div className="container section"><p className="error-message">{error}</p></div>;
  if (!post) return null;

  return (
    <div className="single-blog-page section">
      <div className="container">
        <article className="blog-post-content">
          <header className="blog-post-header">
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              <span>By <Link to={`/artists/${post.artist._id}`}>{post.artist.name}</Link></span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <img src={post.featuredImage} alt={post.title} className="featured-image" />
          </header>
          {/* This assumes your blog content is plain text. For HTML, you'd use dangerouslySetInnerHTML */}
          <div className="post-body">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>
          {user ? (
            <CommentForm postId={postId} onCommentPosted={fetchPostAndComments} />
          ) : (
            <p>Please <Link to="/login" style={{textDecoration: 'underline'}}>log in</Link> to leave a comment.</p>
          )}

          <div className="comments-list">
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment._id} className="comment-card">
                        <p className="comment-content">{comment.content}</p>
                        <p className="comment-author">- {comment.author.name}</p>
                    </div>
                ))
            ) : (
                <p>No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleBlogPostPage;