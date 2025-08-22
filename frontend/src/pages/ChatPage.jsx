import React, { useEffect, useState, useRef } from 'react';
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

    // Data State
    const [recipient, setRecipient] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [commissions, setCommissions] = useState([]);
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refs
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- EFFECTS ---

    // 1. Initialize the chat session
    useEffect(() => {
        if (authLoading) {
            console.log("ChatPage waiting for auth...");
            return; // Wait until the authentication check is complete
        }
        if (!user) {
            console.log("No user found, redirecting to login.");
            navigate('/login');
            return;
        }
        if (!recipientId) {
            console.log("No recipient ID in URL.");
            setError("Cannot start a chat without a recipient.");
            setPageLoading(false);
            return;
        }

        const initializeChat = async () => {
            console.log("Initializing chat with recipient:", recipientId);
            setPageLoading(true);
            setError(null);
            try {
                const recipientFromState = location.state?.recipient;
                const recipientModel = recipientFromState?.role === 'artist' ? 'Artist' : 'User';
                
                const response = await apiClient.post('/chat/conversations', { recipientId, recipientModel });
                const convo = response.data.conversation;
                console.log("Conversation loaded:", convo._id);
                setConversationId(convo._id);

                const otherParticipant = convo.participants.find(p => p && p._id !== user.userId);
                if (otherParticipant) {
                    setRecipient(otherParticipant);
                } else { throw new Error("Could not identify the other chat participant."); }

            } catch (err) {
                console.error('CRITICAL: Failed to initialize chat session', err);
                setError('Failed to load conversation. Please try again later.');
            } finally {
                console.log("Finished initialization, setting page loading to false.");
                setPageLoading(false);
            }
        };

        initializeChat();
    }, [recipientId, user, authLoading, location.state, navigate]);

    // 2. Poll for messages
    useEffect(() => {
        if (!conversationId) return;
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
                setMessages(response.data.messages || []);
            } catch (err) { console.error('Polling messages failed:', err); }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    // 3. Poll for commissions
    useEffect(() => {
        if (!conversationId) return;
        const fetchCommissions = async () => {
            try {
                const response = await apiClient.get(`/commissions/conversation/${conversationId}`);
                setCommissions(response.data.commissions || []);
            } catch (err) { console.error('Polling commissions failed:', err); }
        };
        fetchCommissions();
        const interval = setInterval(fetchCommissions, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    // 4. Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, commissions]);
    

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
        } catch (err) { console.error('Failed to send message', err); }
    };
    
    const handleAcceptCommission = async (commissionId) => {
        try {
            await apiClient.post(`/commissions/${commissionId}/accept`);
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
            {/* The modal for creating commissions lives outside the main layout */}
            <CommissionFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCommission}
            />
            
            <div className="chat-page-layout section">
                {/* --- MAIN CHAT CONTAINER (LEFT COLUMN) --- */}
                <div className="chat-container">
                    <div className="chat-header">
                        {recipient && (
                            <>
                                <img src={recipient.profilePicture || '/default-profile.png'} alt={recipient.name} className="chat-avatar" />
                                <h2>Chat with {recipient.name}</h2>
                            </>
                        )}
                    </div>
                    <div className="chat-messages-container">
                        {chatFeed.length > 0 ? (
                            chatFeed.map((item) => {
                                // Check if the item is a commission to render the special card
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
                                // Check if the item is a message
                                if (item.content || item.imageUrl) {
                                    const msg = item;
                                    return (
                                        <div key={`msg-${msg._id}`} className={`message-item ${msg.senderId === user.userId ? 'self' : 'other'}`}>
                                            {msg.imageUrl && <img src={msg.imageUrl} alt="Chat attachment" className="chat-image" />}
                                            {msg.content && <p>{msg.content}</p>}
                                        </div>
                                    );
                                }
                                return null; // Don't render commissions with other statuses in the main feed
                            })
                        ) : (
                            !pageLoading && <p className="no-messages">No messages yet. Say hello!</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Button for the artist to open the commission creation modal */}
                    {user.role === 'artist' && (
                        <div className="create-commission-area">
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-outline">
                                Create Commission Offer
                            </button>
                        </div>
                    )}
                    
                    {/* The message input form */}
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <input type="file" ref={fileInputRef} id="file-input" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                        <label htmlFor="file-input" className="file-input-label">📎</label>
                        <input type="text" placeholder={imageFile ? imageFile.name : "Type your message..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={!conversationId}/>
                        <button type="submit" className="btn btn-primary" disabled={!conversationId}>Send</button>
                    </form>
                </div>

                {/* --- COMMISSION MANAGEMENT PANEL (RIGHT COLUMN) --- */}
                <aside className="commission-panel-container">
                    <CommissionPanel commissions={commissions} onUpdate={() => { /* Polling handles updates */ }} />
                </aside>
            </div>
        </>
    );
};

export default ChatPage;