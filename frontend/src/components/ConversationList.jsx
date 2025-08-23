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
  const uniqueConversations = new Map();

  conversations.forEach(convo => {
    if (convo.participants && Array.isArray(convo.participants)) {
      // Create a unique key by sorting the participant IDs and joining them.
      // This ensures that a chat between UserA-UserB and UserB-UserA are treated as the same.
      const conversationKey = convo.participants
        .map(p => p._id)
        .sort()
        .join('-');

      // If we haven't seen this key before, add the conversation to our map.
      if (!uniqueConversations.has(conversationKey)) {
        uniqueConversations.set(conversationKey, convo);
      }
    }
  });

  // Convert the Map back to an array to render it.
  const filteredConversations = Array.from(uniqueConversations.values());

  return (
    <div className="conversation-list">
      <h3>My Messages</h3>
      {/* --- USE THE NEW `filteredConversations` ARRAY --- */}
      {filteredConversations.length > 0 ? (
        <ul className="conversation-items">
          {filteredConversations.map(convo => {
            const otherParticipant = convo.participants.find(p => p && p._id !== user.userId);

            if (!otherParticipant) {
              return null;
            }

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