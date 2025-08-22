// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import ConversationList from '../components/ConversationList'; // <-- IMPORT

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container section">
      <h1>Welcome to your Dashboard, {user?.name}</h1>
      <p>This is your private space to manage your activities on KalaKosha.</p>
      
      <hr style={{ margin: '2rem 0' }} />

      {/* --- RENDER THE CONVERSATION LIST --- */}
      <ConversationList />
      
      {/* Other dashboard sections can go here */}
      {/* e.g., <MyOrders />, <MyProfileEditor /> */}
    </div>
  );
};

export default DashboardPage;