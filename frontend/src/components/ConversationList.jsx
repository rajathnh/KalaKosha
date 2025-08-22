// src/components/ConversationList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ConversationList.css'; // We'll create this

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await apiClient.get('/chat/my-conversations');
        setConversations(response.data.conversations);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) return <p>Loading conversations...</p>;

  return (
    <div className="conversation-list">
      <h3>My Messages</h3>
      {conversations.length > 0 ? (
        <ul>
          {conversations.map(convo => {
            // Find the other participant in the conversation
            const otherParticipant = convo.participants.find(p => p._id !== user.userId);
            if (!otherParticipant) return null; // Should not happen

            return (
              <li key={convo._id}>
                {/* This link will take the artist to the same ChatPage */}
                <Link to="/chat" state={{ artist: otherParticipant }}>
                  <img src={otherParticipant.profilePicture} alt={otherParticipant.name} />
                  <span>Chat with {otherParticipant.name}</span>
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