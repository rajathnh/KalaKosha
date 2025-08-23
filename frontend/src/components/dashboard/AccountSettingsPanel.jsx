// src/components/dashboard/AccountSettingsPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/axios';
import '../../pages/LoginPage.css'; // Reusing login form styles

const AccountSettingsPanel = () => {
  const { user, setUser } = useAuth(); // We need setUser to update the context
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleDetailsUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.patch('/users/update-user', { name, email });
      setUser(response.data.user); // Update the global user state
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch('/users/update-password', { oldPassword, newPassword });
      setPasswordMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMessage('Error updating password. Check your old password.');
    }
  };

  return (
    <div className="account-settings-panel">
      <h2>Account Settings</h2>
      <div className="settings-forms-container">
        {/* Update Details Form */}
        <form onSubmit={handleDetailsUpdate} className="login-form settings-form">
          <h3>Update Your Details</h3>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
          {message && <p>{message}</p>}
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordUpdate} className="login-form settings-form">
          <h3>Change Your Password</h3>
          <div className="form-group">
            <label>Old Password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Update Password</button>
          {passwordMessage && <p>{passwordMessage}</p>}
        </form>
      </div>
    </div>
  );
};
export default AccountSettingsPanel;