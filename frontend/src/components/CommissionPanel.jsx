// src/components/CommissionPanel.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import './CommissionPanel.css'; // We'll create this

const CommissionPanel = ({ commissions, onUpdate }) => {
  const { user } = useAuth();

  const handleArtistComplete = async (commissionId) => {
    try {
        await apiClient.patch(`/commissions/${commissionId}/artist-complete`);
        onUpdate(); // Tell the parent (ChatPage) to refresh its data
    } catch (err) { console.error(err); }
  };

  const handleCustomerConfirm = async (commissionId) => {
    try {
        await apiClient.patch(`/commissions/${commissionId}/customer-confirm`);
        onUpdate();
    } catch (err) { console.error(err); }
  };
  
  // TODO: Add handler for 'Leave a Review' button

  return (
    <div className="commission-panel">
      <h4>Commission Status</h4>
      {commissions.length === 0 ? (
        <p className="no-commissions">No commission offers have been made in this chat yet.</p>
      ) : (
        commissions.map(c => (
          <div key={c._id} className="commission-item">
            <h5>{c.title}</h5>
            <div className="commission-status-box">
                Status: <strong>{c.status}</strong>
            </div>
            <p className="commission-price">${c.price}</p>
            <div className="commission-actions">
              {user.role === 'artist' && (c.status === 'Accepted' || c.status === 'InProgress') && (
                <button onClick={() => handleArtistComplete(c._id)} className="btn btn-primary">Mark as Complete</button>
              )}
              {user.role !== 'artist' && c.status === 'ArtistMarkedComplete' && (
                <button onClick={() => handleCustomerConfirm(c._id)} className="btn btn-primary">Confirm Delivery</button>
              )}
              {user.role !== 'artist' && c.status === 'Completed' && (
                <button className="btn btn-outline">Leave a Review</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommissionPanel;