// src/components/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './NotificationBell.css'; // We'll create this next

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get('/notifications');
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // If opening and there are unread notifications, mark them as read
      try {
        await apiClient.patch('/notifications/read');
        // Optimistically update the UI
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (error) {
        console.error('Failed to mark notifications as read', error);
      }
    }
  };

  return (
    <div className="notification-bell">
      <button onClick={handleToggle} className="bell-button" aria-label="Toggle notifications">
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <Link to={n.link} key={n._id} className="notification-item" onClick={() => setIsOpen(false)}>
                <p>{n.message}</p>
                <span className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</span>
              </Link>
            ))
          ) : (
            <div className="notification-item-empty">No new notifications.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;