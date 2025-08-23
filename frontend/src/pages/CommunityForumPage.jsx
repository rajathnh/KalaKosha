import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './CommunityForumPage.css';
import { useNavigate, Link } from 'react-router-dom'; // <-- IMPORT Link and useNavigate

const CommunityForumPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // <-- Initialize useNavigate
    
    // State for the forum feed
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // State for the new message form
    const [newMessage, setNewMessage] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState('');
    
    const fileInputRef = useRef(null);

    // Function to fetch messages from the API
    const fetchMessages = useCallback(async (pageNum) => {
        if (pageNum === 1) setLoading(true); // Only show full loading spinner on first page load
        try {
            const response = await apiClient.get(`/forum?page=${pageNum}&limit=10`);
            const { messages: newMessages, hasMore: newHasMore } = response.data;
            
            setMessages(prev => pageNum === 1 ? newMessages : [...prev, ...newMessages]);
            setHasMore(newHasMore);
        } catch (error) {
            console.error("Failed to fetch forum messages:", error);
        } finally {
            if (pageNum === 1) setLoading(false);
        }
    }, []);

    // --- START OF POLLING AND AUTH LOGIC ---

    // Effect for initial load and setting up polling
    useEffect(() => {
        fetchMessages(1); // Initial fetch

        const interval = setInterval(async () => {
            // Polling logic: only fetch new messages for the first page
            try {
                const response = await apiClient.get(`/forum?page=1&limit=10`);
                // This is a simple way to merge. It assumes few new messages.
                // For a high-traffic site, you'd check for duplicates.
                setMessages(prevMessages => {
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const newIncomingMessages = response.data.messages.filter(m => !existingIds.has(m.id));
                    return [...newIncomingMessages, ...prevMessages];
                });
            } catch (error) {
                console.error("Polling failed:", error);
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [fetchMessages]);


    const handleFocusTextarea = () => {
        if (!user) {
            // Redirect non-logged-in users to the login page
            // We pass state to redirect them back here after logging in
            navigate('/login', { state: { from: { pathname: '/forum' } } });
        }
    };

    // --- END OF POLLING AND AUTH LOGIC ---

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
    };

    const handleFileChange = (e) => {
        if (!user) {
            handleFocusTextarea(); // Also redirect if they try to use the file button
            return;
        }
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        // The handleFocusTextarea already prevents non-users from typing, but this is a backup
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/forum' } } });
            return;
        }
        if (!newMessage.trim() && !mediaFile) {
            setPostError("Please write a message or select a file to post.");
            return;
        }
        
        setIsPosting(true);
        setPostError('');

        const formData = new FormData();
        formData.append('message', newMessage);
        if (mediaFile) {
            formData.append('media', mediaFile);
        }

        try {
            await apiClient.post('/forum', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // After posting, trigger an immediate refresh of the first page to show the new message
            fetchMessages(1);

            // Reset the form
            setNewMessage('');
            setMediaFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setPostError(err.response?.data?.msg || "Failed to post message.");
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) {
        return <div className="container section"><h2>Loading Community Forum...</h2></div>
    }

    return (
        <div className="forum-page section">
            <div className="container">
                <header className="forum-header">
                    <h1>Community Forum</h1>
                    <p>Share your work, ask questions, and connect with fellow artists and art lovers.</p>
                </header>

                {/* --- New Post Form --- */}
                <div className="post-form-container">
                    <form onSubmit={handlePostSubmit} className="post-form">
                        <textarea
                            placeholder={user ? `What's on your mind, ${user.name}?` : "Log in to join the conversation..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={handleFocusTextarea} // <-- Check auth on focus
                            rows="3"
                        />
                        <div className="form-actions">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*,video/*"
                                id="media-upload"
                                hidden
                            />
                            <label htmlFor="media-upload" className="btn btn-outline">
                                {mediaFile ? `Selected: ${mediaFile.name.substring(0, 20)}...` : '📷 Add Media'}
                            </label>
                            <button type="submit" className="btn btn-primary" disabled={isPosting}>
                                {isPosting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                        {postError && <p className="form-error">{postError}</p>}
                    </form>
                </div>
                
                {/* --- Forum Feed --- */}
                <div className="forum-feed">
                    {messages.map(msg => (
                        <div key={msg.id} className="forum-post-card">
                            <div className="post-author-info">
                                <img 
                                    src={msg.author?.profilePicture || '/uploads/default-artist.png'} 
                                    alt={msg.userName} 
                                    className="author-avatar"
                                />
                                <div>
                                    <p className="author-name">{msg.userName}</p>
                                    <p className="post-timestamp">{new Date(msg.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            {msg.message && <p className="post-message">{msg.message}</p>}
                            {msg.mediaUrl && (
                                <div className="post-media">
                                    {msg.mediaType === 'video' ? (
                                        <video src={msg.mediaUrl} controls />
                                    ) : (
                                        <img src={msg.mediaUrl} alt="Forum media" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- Load More Button --- */}
                {hasMore && !loading && (
                    <div className="load-more-container">
                        <button onClick={handleLoadMore} className="btn btn-primary">
                            Load More
                        </button>
                    </div>
                )}
                {!hasMore && <p className="text-center">You've reached the end of the conversation.</p>}
            </div>
        </div>
    );
};

export default CommunityForumPage;