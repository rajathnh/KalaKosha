// src/pages/RegisterUserPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// We can reuse the LoginPage.css for a consistent look
import './LoginPage.css';

const RegisterUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registerUser } = useAuth(); // We'll add this to AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Register as an Art Lover</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {/* Form fields for name, email, password */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;