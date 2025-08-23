import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

// Import all the panel components needed for the dashboard
// Customer-specific panels
import MyOrdersPanel from '../components/dashboard/MyOrdersPanel';
import MyEnrollmentsPanel from '../components/dashboard/MyEnrollmentsPanel';

// Artist-specific panels
import MyArtworksPanel from '../components/dashboard/MyArtworksPanel';
import MyCoursesPanel from '../components/dashboard/MyCoursesPanel';
import MyBlogsPanel from '../components/dashboard/MyBlogsPanel';

// Shared panels (for both roles)
import MessagesPanel from '../components/dashboard/MessagesPanel';
import AccountSettingsPanel from '../components/dashboard/AccountSettingsPanel';

const DashboardPage = () => {
  const { user } = useAuth();

  // Set the default active panel based on the user's role
  const defaultPanel = user?.role === 'artist' ? 'artworks' : 'orders';
  const [activePanel, setActivePanel] = useState(defaultPanel);

  // A helper function to render the correct panel based on the state
  const renderPanel = () => {
    switch (activePanel) {
      // --- Customer Panels ---
      case 'orders':
        return <MyOrdersPanel />;
      case 'enrollments':
        return <MyEnrollmentsPanel />;

      // --- Artist Panels ---
      case 'artworks':
        return <MyArtworksPanel />;
      case 'courses':
        return <MyCoursesPanel />;
      case 'blogs':
        return <MyBlogsPanel />;
      
      // --- Shared Panels ---
      case 'messages':
        return <MessagesPanel />;
      case 'settings':
        return <AccountSettingsPanel />;
        
      default:
        // Fallback to the default panel for their role
        return user?.role === 'artist' ? <MyArtworksPanel /> : <MyOrdersPanel />;
    }
  };
  
  return (
    <div className="dashboard-page section">
      <div className="container">
        <header className="dashboard-header">
          <h1>Welcome, {user?.name}</h1>
          <p>Manage your KalaKosha journey here.</p>
        </header>
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <nav>
              {user?.role === 'artist' ? (
                // --- Artist-Specific Menu ---
                <>
                  <button onClick={() => setActivePanel('artworks')} className={activePanel === 'artworks' ? 'active' : ''}>My Artworks</button>
                  <button onClick={() => setActivePanel('courses')} className={activePanel === 'courses' ? 'active' : ''}>My Courses</button>
                  <button onClick={() => setActivePanel('blogs')} className={activePanel === 'blogs' ? 'active' : ''}>My Blogs</button>
                </>
              ) : (
                // --- Customer-Specific Menu ---
                <>
                  <button onClick={() => setActivePanel('orders')} className={activePanel === 'orders' ? 'active' : ''}>My Orders</button>
                  <button onClick={() => setActivePanel('enrollments')} className={activePanel === 'enrollments' ? 'active' : ''}>My Enrollments</button>
                </>
              )}

              {/* --- Shared Menu Items (for both roles) --- */}
              <button onClick={() => setActivePanel('messages')} className={activePanel === 'messages' ? 'active' : ''}>Messages</button>
              <button onClick={() => setActivePanel('settings')} className={activePanel === 'settings' ? 'active' : ''}>Account Settings</button>
            </nav>
          </aside>
          <main className="dashboard-content">
            {renderPanel()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;