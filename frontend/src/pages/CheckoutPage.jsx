// src/pages/CheckoutPage.jsx
import React from 'react';
// This page will eventually get the item details from the URL or context
// For now, it's a simple placeholder

const CheckoutPage = () => {
  return (
    <div className="container section">
      <h1>Checkout</h1>
      <p>This is where the payment process for your artwork will happen.</p>
      {/* We will add the Stripe payment form here later */}
      <button className="btn btn-primary">Proceed to Payment</button>
    </div>
  );
};

export default CheckoutPage;