// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterGateway from './pages/RegisterGateway';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterArtistPage from './pages/RegisterArtistPage';
import ArtworkListPage from './pages/ArtworkListPage';
import SingleArtworkPage from './pages/SingleArtworkPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import CheckoutPage from './pages/CheckoutPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
function App() {
  return (
    <div className="App">
      <Navbar />
      <main style={{ paddingTop: '80px' }}> {/* Add padding to prevent content from hiding under the fixed navbar */}
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/artworks" element={<ArtworkListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterGateway />} />
          <Route path="/register/user" element={<RegisterUserPage />} />
          <Route path="/register/artist" element={<RegisterArtistPage />} />
          <Route path="/artworks/:id" element={<SingleArtworkPage />} />
          <Route path="/artists/:id" element={<ArtistProfilePage />} />
          {/* --- Protected Routes (to be built) --- */}
          <Route 
    path="/checkout/:artworkId" // The URL will contain the ID of the artwork to buy
    element={
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    } 
  />
<Route 
    path="/chat" 
    element={
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />

        </Routes>
        
      </main>
      <Footer />
    </div>
  );
}

export default App;