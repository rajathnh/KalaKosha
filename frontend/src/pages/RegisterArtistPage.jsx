// src/pages/RegisterArtistPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reusing styles

const RegisterArtistPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialization: '', bio: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const { registerArtist } = useAuth(); // We'll add this to AuthContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistData = new FormData();
    for (const key in formData) {
      artistData.append(key, formData[key]);
    }
    if (profilePicture) {
      artistData.append('profilePicture', profilePicture);
    }

    try {
      await registerArtist(artistData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Register as an Artist</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {/* Form fields for name, email, password, specialization, bio, and a file input */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="specialization">Specializations (comma-separated)</label>
            <input type="text" name="specialization" onChange={handleChange} required />
          </div>
           <div className="form-group">
            <label htmlFor="bio">Your Bio</label>
            <textarea name="bio" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input type="file" name="profilePicture" onChange={handleFileChange} />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Create Artist Account</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterArtistPage;