import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ConversationList.css';

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only attempt to fetch conversations if the user object is available
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/chat/my-conversations');
        setConversations(response.data.conversations || []); // Default to empty array if response is weird
      } catch (err) {
        setError("Could not load your messages.");
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]); // Re-run this effect if the user state changes (e.g., on login)

  if (loading) {
    return <p>Loading conversations...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="conversation-list">
      <h3>My Messages</h3>
      {conversations.length > 0 ? (
        <ul className="conversation-items">
          {conversations.map(convo => {
            // Defensive check: Ensure participants array exists and is an array
            if (!convo.participants || !Array.isArray(convo.participants)) {
              return null;
            }
            
            // Find the other person in the chat
            const otherParticipant = convo.participants.find(p => p && p._id !== user.userId);

            // Defensive check: Ensure the other participant was found
            if (!otherParticipant) {
              return null;
            }

            // The data we'll pass to the ChatPage upon navigation
            const linkState = { recipient: otherParticipant };

            return (
              <li key={convo._id} className="conversation-item">
                <Link to={`/chat/${otherParticipant._id}`} state={linkState}>
                  <img 
                    src={otherParticipant.profilePicture || '/default-profile.png'} 
                    alt={otherParticipant.name} 
                    className="conversation-avatar"
                  />
                  <div className="conversation-details">
                    <span className="conversation-name">
                      {otherParticipant.name}
                    </span>
                    {/* You can add a placeholder for the last message later */}
                    <span className="conversation-preview">
                      Click to view conversation...
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have no messages yet.</p>
      )}
    </div>
  );
};

export default ConversationList;