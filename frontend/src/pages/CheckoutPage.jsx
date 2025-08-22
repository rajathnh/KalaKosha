// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css'; // We'll create this

const CheckoutPage = () => {
  // The URL will be either '/checkout/artwork/:id' or '/checkout/course/:id'
  const { artworkId, courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        let response;
        if (artworkId) {
          setItemType('Artwork');
          response = await apiClient.get(`/artworks/${artworkId}`);
          setItem(response.data.artwork);
        } else if (courseId) {
          setItemType('Course');
          response = await apiClient.get(`/courses/${courseId}`);
          setItem(response.data.course);
        } else {
          throw new Error('No item specified for checkout.');
        }
      } catch (err) {
        setError('Could not load item details for checkout.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [artworkId, courseId]);

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    try {
      // The frontend sends the cart structure the backend expects
      const cart = {
        items: [{
          type: itemType,
          productId: item._id
        }],
        shippingFee: itemType === 'Artwork' ? 500 : 0, // Example shipping fee
      };

      await apiClient.post('/orders', cart);
      
      alert('Purchase successful! Thank you.');
      navigate('/dashboard'); // Redirect to dashboard to see the order
    } catch (err) {
      alert(err.response?.data?.msg || 'An error occurred during purchase.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="container section"><h2>Loading Checkout...</h2></div>;
  if (error) return <div className="container section"><p className="error-message">{error}</p></div>;
  if (!item) return null;

  const price = item.price;
  const shipping = itemType === 'Artwork' ? 500 : 0;
  const total = price + shipping;

  return (
    <div className="checkout-page section">
      <div className="container">
        <h1>Order Summary</h1>
        <div className="checkout-layout">
          <div className="order-details">
            <div className="order-item">
              <img src={item.image || item.coverImage} alt={item.title} className="item-thumbnail" />
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>By {item.artist.name}</p>
              </div>
              <p className="item-price">${price}</p>
            </div>
          </div>
          <div className="payment-summary">
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${price}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <button onClick={handleConfirmPurchase} className="btn btn-primary btn-block" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;