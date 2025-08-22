// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

// --- ADD EXPORT HERE ---
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // You can keep this commented out for now
  // useEffect(() => { ... }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      setUser(response.data.user);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => { /* ... logic ... */ };

  const logout = async () => {
    try {
      await apiClient.get('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    const registerUser = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/user', userData);
      setUser(response.data.user);
      return response;
    } catch (error) { throw error; }
  };

  const registerArtist = async (artistData) => {
    try {
      // Important: Set content-type for file uploads
      const response = await apiClient.post('/auth/register/artist', artistData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data.user);
      return response;
    } catch (error) { throw error; }
  };
  // The value provided by the context
  const value = { user, loading, login, register, logout,registerUser, registerArtist };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- THIS IS THE CORRECT WAY TO CREATE THE HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // The initial value can be null before the provider is mounted
  return context;
};