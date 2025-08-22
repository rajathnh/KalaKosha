// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './ChatPage.css';

const ChatPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    
    // State for the conversation
    const [artistToContact, setArtistToContact] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    
    // State for the input form
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null); // To auto-scroll to the bottom

    // Effect to get or create the conversation
    useEffect(() => {
        const artist = location.state?.artist;
        if (artist) {
            setArtistToContact(artist);
            const getOrCreateConvo = async () => {
                try {
                    const response = await apiClient.post('/chat/conversations', {
                        recipientId: artist._id,
                        recipientModel: 'Artist',
                    });
                    setConversationId(response.data.conversation._id);
                } catch (error) {
                    console.error('Failed to start conversation', error);
                }
            };
            getOrCreateConvo();
        }
    }, [location.state]);

    // Effect for polling messages
    useEffect(() => {
        if (!conversationId) return;

        setLoading(true);
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages(); // Initial fetch
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [conversationId]);

    // Effect to scroll to the bottom of the chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const tempMessage = { // Optimistic UI update
                _id: Date.now(),
                senderId: user.userId,
                content: newMessage,
            };
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
                content: newMessage,
            });
            // The next poll will fetch the "real" message from the DB
        } catch (error) {
            console.error('Failed to send message', error);
            // Optionally, remove the temp message on failure
        }
    };

    return (
        <div className="chat-page section">
            <div className="container">
                <div className="chat-header">
                    {artistToContact && (
                        <>
                            <img src={artistToContact.profilePicture} alt={artistToContact.name} className="chat-avatar" />
                            <h2>Chat with {artistToContact.name}</h2>
                        </>
                    )}
                </div>
                <div className="chat-messages-container">
                    {loading && messages.length === 0 && <p>Loading messages...</p>}
                    {messages.map((msg) => (
                        <div key={msg._id} className={`message-item ${msg.senderId === user.userId ? 'self' : 'other'}`}>
                            <p>{msg.content}</p>
                            {/* We can add timestamps later */}
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
                </div>
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;