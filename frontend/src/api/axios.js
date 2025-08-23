// src/api/axios.js
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
// Create a new instance of axios with a custom configuration
const apiClient = axios.create({
  // This is the base URL of your backend server
  baseURL: baseURL,
  
  // This is CRITICAL for sending the httpOnly cookie with requests
  withCredentials: true, 
});

// Export the configured instance so you can use it everywhere else
export default apiClient;