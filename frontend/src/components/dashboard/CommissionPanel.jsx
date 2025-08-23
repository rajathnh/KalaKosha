import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import CommissionReviewModal from './CommissionReviewModal';
import './CommissionPanel.css';

const CommissionPanel = ({ commissions, onUpdate }) => {
  const { user } = useAuth();
  
  // State to manage which commission is being reviewed and if the modal is open
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  // --- API HANDLERS ---

  // Called when an ARTIST clicks "Mark as Complete"
  const handleArtistComplete = async (commissionId) => {
    try {
      await apiClient.patch(`/commissions/${commissionId}/artist-complete`);
      onUpdate(); // Trigger a data refresh in the parent component (ChatPage)
    } catch (err) {
      alert("Error: Could not mark the commission as complete.");
      console.error(err);
    }
  };

  // Called when a CUSTOMER clicks "Confirm Delivery"
  const handleCustomerConfirm = async (commissionId) => {
    try {
      await apiClient.patch(`/commissions/${commissionId}/customer-confirm`);
      onUpdate(); // Trigger a data refresh
    } catch (err) {
      alert("Error: Could not confirm the delivery.");
      console.error(err);
    }
  };
  
  // --- MODAL HANDLERS ---

  // Opens the modal and sets the commission to be reviewed
  const handleOpenReviewModal = (commission) => {
    setSelectedCommission(commission);
    setIsReviewModalOpen(true);
  };

  // Called from the modal on successful submission
  const handleReviewSubmit = () => {
    setIsReviewModalOpen(false); // Close the modal
    setSelectedCommission(null); // Clear the selected commission
    onUpdate(); // Trigger a data refresh to hide the "Leave a Review" button
  };

  return (
    <>
      {/* The Review Modal is rendered here but is only visible when isReviewModalOpen is true */}
      <CommissionReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        commission={selectedCommission}
        onReviewSubmit={handleReviewSubmit}
      />

      <div className="commission-panel">
        <h4>Commission Status</h4>
        {commissions.length === 0 ? (
          <p className="no-commissions">No commission offers have been made in this chat yet.</p>
        ) : (
          commissions.map(c => (
            <div key={c._id} className="commission-item">
              <h5>{c.title}</h5>
              <div className="commission-status-box">Status: <strong>{c.status}</strong></div>
              <p className="commission-price">${c.price}</p>
              
              <div className="commission-actions">
                {/* --- Action Buttons (conditionally rendered) --- */}

                {/* ARTIST'S ACTION: Can mark as complete if it's in progress */}
                {user.role === 'artist' && (c.status === 'Accepted' || c.status === 'InProgress') && (
                  <button onClick={() => handleArtistComplete(c._id)} className="btn btn-primary">Mark as Complete</button>
                )}

                {/* CUSTOMER'S ACTION 1: Can confirm delivery after artist marks it complete */}
                {user.role !== 'artist' && c.status === 'ArtistMarkedComplete' && (
                  <button onClick={() => handleCustomerConfirm(c._id)} className="btn btn-primary">Confirm Delivery</button>
                )}

                {/* CUSTOMER'S ACTION 2: Can leave a review ONLY if it's completed AND not yet reviewed */}
                {user.role !== 'artist' && c.status === 'Completed' && !c.review && (
                    <button onClick={() => handleOpenReviewModal(c)} className="btn btn-outline">
                      Leave a Review
                    </button>
                )}

                {/* VISUAL FEEDBACK: Show a badge if a review has been left */}
                {c.review && (
                  <div className="reviewed-badge">✔️ Reviewed</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CommissionPanel;