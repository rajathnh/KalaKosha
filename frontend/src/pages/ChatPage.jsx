import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './ChatPage.css';
import CommissionFormModal from '../components/CommissionFormModal';
import CommissionPanel from '../components/CommissionPanel';

const ChatPage = () => {
    // --- STATE MANAGEMENT ---
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();
    const { recipientId } = useParams();
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [userJustSentMessage, setUserJustSentMessage] = useState(false);

    // --- DATA FETCHING FUNCTIONS ---
    const fetchCommissions = useCallback(async () => {
        if (!conversationId) return;
        try {
            const response = await apiClient.get(`/commissions/conversation/${conversationId}`);
            setCommissions(response.data.commissions || []);
        } catch (err) { 
            console.error('Polling commissions failed:', err); 
        }
    }, [conversationId]);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;
        try {
            const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
            setMessages(response.data.messages || []);
        } catch (err) { 
            console.error('Polling messages failed:', err); 
        }
    }, [conversationId]);

    // --- EFFECTS ---

    // 1. Initialize the chat session
    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate('/login'); return; }
        if (!recipientId) {
            setError("Cannot start a chat without a recipient.");
            setPageLoading(false);
            return;
        }
                const initializeChat = async () => {
                        setPageLoading(true);
                        setError(null);
                        try {
                                const recipientFromState = location.state?.recipient;
                                const recipientModel = recipientFromState?.role === 'artist' ? 'Artist' : 'User';
                                const response = await apiClient.post('/chat/conversations', { recipientId, recipientModel });
                                const convo = response.data.conversation;
                                setConversationId(convo._id);
                                const otherParticipantId = convo.participants.find(p => p && p !== user.userId && p._id === undefined ? p : p._id !== user.userId ? p._id : null);
                                // If the participant is an object, use _id, else use the string
                                let idToFetch = otherParticipantId;
                                if (typeof otherParticipantId === 'object' && otherParticipantId._id) {
                                    idToFetch = otherParticipantId._id;
                                }
                                // Fetch full recipient details
                                let recipientDetails = null;
                                if (recipientModel === 'Artist') {
                                    const artistRes = await apiClient.get(`/artists/${idToFetch}`);
                                    recipientDetails = artistRes.data.profile.artist;
                                } else {
                                    const userRes = await apiClient.get(`/users/${idToFetch}`);
                                    recipientDetails = userRes.data.user;
                                }
                                setRecipient(recipientDetails);
                        } catch (err) {
                                setError('Failed to load conversation. Please try again later.');
                        } finally {
                                setPageLoading(false);
                        }
                };
                initializeChat();
    }, [recipientId, user, authLoading, location.state, navigate]);

    // 2. Set up polling for new messages and commissions
    useEffect(() => {
        if (!conversationId) return;
        
        // Fetch immediately when conversation starts
        fetchMessages();
        fetchCommissions();
        
        // Then set up the interval to poll every 5 seconds
        const interval = setInterval(() => {
            fetchMessages();
            fetchCommissions();
        }, 5000);
        
        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [conversationId, fetchMessages, fetchCommissions]);

    // 3. Handle scrolling - only scroll to bottom on initial load or after user sends message
    useEffect(() => {
        const container = messagesContainerRef.current;
        const messagesEnd = messagesEndRef.current;
        
        if (!container || !messagesEnd) return;

        // Only scroll in these specific cases:
        if (isInitialLoad && messages.length > 0) {
            // Initial load - scroll to bottom to show latest messages
            container.scrollTop = container.scrollHeight;
            setIsInitialLoad(false);
        } else if (userJustSentMessage) {
            // User just sent a message - scroll to show their new message
            container.scrollTop = container.scrollHeight;
            setUserJustSentMessage(false);
        }
    }, [messages, commissions, isInitialLoad, userJustSentMessage]);

    // --- HANDLER FUNCTIONS ---
    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !imageFile) || !conversationId) return;
        
        const formData = new FormData();
        formData.append('content', newMessage);
        if (imageFile) formData.append('image', imageFile);
        
        setNewMessage('');
        setImageFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        
        try {
            await apiClient.post(`/chat/conversations/${conversationId}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            // Mark that user just sent a message so we can scroll to show it
            setUserJustSentMessage(true);
            await fetchMessages();
        } catch (err) { 
            console.error('Failed to send message', err); 
        }
    };
    
    const handleAcceptCommission = async (commissionId) => {
        try {
            await apiClient.post(`/commissions/${commissionId}/accept`);
            fetchCommissions(); // Manually refresh commission status
        } catch(err) {
            alert('Could not accept the commission.');
            console.error(err);
        }
    };
    
    const handleCreateCommission = async (commissionData) => {
        try {
            await apiClient.post('/commissions', {
                ...commissionData, customerId: recipientId, conversationId: conversationId,
            });
            setIsModalOpen(false);
            fetchCommissions(); // Manually refresh to show new offer
        } catch (err) {
            alert('Error: Could not create commission offer.');
            console.error(err);
        }
    };

    // --- RENDER LOGIC ---
    if (pageLoading || authLoading) {
        return <div className="container section"><h2>Loading Conversation...</h2></div>;
    }

    if (error) {
        return <div className="container section"><p className="error-message">{error}</p></div>;
    }

    const chatFeed = [...messages, ...commissions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return (
        <>
            <CommissionFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCommission}
            />
            <div className="chat-page-layout section">
                <div className="chat-container">
                    <div className="chat-header">
                        {recipient && (
                            <>
                                <img src={recipient.profilePicture || '/default-profile.png'} alt={recipient.name} className="chat-avatar" />
                                <h2>Chat with {recipient.name}</h2>
                            </>
                        )}
                    </div>
                    <div className="chat-messages-container" ref={messagesContainerRef}>
                        {chatFeed.length > 0 ? (
                            chatFeed.map((item) => {
                                if (item.status && item.status === 'Offered' && user.role !== 'artist') {
                                    return (
                                        <div key={`comm-${item._id}`} className="commission-card">
                                            <h4>Commission Offer: {item.title}</h4>
                                            <p>{item.description}</p>
                                            <div className="commission-footer">
                                                <span className="commission-price">${item.price}</span>
                                                <button onClick={() => handleAcceptCommission(item._id)} className="btn btn-primary">Accept & Pay</button>
                                            </div>
                                        </div>
                                    );
                                }
                                if (item.content || item.imageUrl) {
                                    const msg = item;
                                    return (
                                        <div key={`msg-${msg._id}`} className={`message-item ${msg.senderId === user.userId ? 'self' : 'other'}`}>
                                            {msg.imageUrl && <img src={msg.imageUrl} alt="Chat attachment" className="chat-image" />}
                                            {msg.content && <p>{msg.content}</p>}
                                        </div>
                                    );
                                }
                                return null;
                            })
                        ) : (
                            !pageLoading && <p className="no-messages">No messages yet. Say hello!</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {user.role === 'artist' && (
                        <div className="create-commission-area">
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-outline">
                                Create Commission Offer
                            </button>
                        </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <input type="file" ref={fileInputRef} id="file-input" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                        <label htmlFor="file-input" className="file-input-label">📎</label>
                        <input type="text" placeholder={imageFile ? imageFile.name : "Type your message..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={!conversationId}/>
                        <button type="submit" className="btn btn-primary" disabled={!conversationId}>Send</button>
                    </form>
                </div>

                <aside className="commission-panel-container">
                    <CommissionPanel 
                        commissions={commissions} 
                        onUpdate={fetchCommissions} 
                    />
                </aside>
            </div>
        </>
    );
};

export default ChatPage;