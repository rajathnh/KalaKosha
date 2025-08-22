// src/api/axios.js
import axios from 'axios';

// Create a new instance of axios with a custom configuration
const apiClient = axios.create({
  // This is the base URL of your backend server
  baseURL: 'http://localhost:5000/api/v1',
  
  // This is CRITICAL for sending the httpOnly cookie with requests
  withCredentials: true, 
});

// Export the configured instance so you can use it everywhere else
export default apiClient;