// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

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
import CourseListPage from './pages/CourseListPage';
import SingleCoursePage from './pages/SingleCoursePage';
import CreateArtworkPage from './pages/CreateArtworkPage';
import CreateCoursePage from './pages/CreateCoursePage';
import CreateBlogPage from './pages/CreateBlogPage'; 
import SingleBlogPostPage from './pages/SingleBlogPostPage';
import BlogListPage from './pages/BlogListPage';

// --- NEW IMPORTS FOR THE DISCOVER SECTION ---
import DiscoverPage from './pages/DiscoverPage';
import ArtFormDetailPage from './pages/ArtFormDetailPage';

import CommunityForumPage from './pages/CommunityForumPage';

function App() {
  return (
    <div className="App">
       <ScrollToTop /> {}
      <Navbar />
      <main style={{ paddingTop: '80px' }}> {/* Add padding to prevent content from hiding under the fixed navbar */}
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />

          {/* --- NEW ROUTES FOR THE DISCOVER SECTION --- */}
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/discover/:artFormId" element={<ArtFormDetailPage />} />

          <Route path="/artworks" element={<ArtworkListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterGateway />} />
          <Route path="/register/user" element={<RegisterUserPage />} />
          <Route path="/register/artist" element={<RegisterArtistPage />} />
          <Route path="/artworks/:id" element={<SingleArtworkPage />} />
          <Route path="/artists/:id" element={<ArtistProfilePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<SingleCoursePage />} />
          <Route path="/blog/:id" element={<SingleBlogPostPage />} />
          <Route path="/blog" element={<BlogListPage />} />

          <Route path="/forum" element={<CommunityForumPage />} />
          {/* --- Protected Routes (to be built) --- */}
          <Route 
            path="/checkout/artwork/:artworkId" // The URL will contain the ID of the artwork to buy
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout/course/:courseId" 
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} 
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
            path="/courses/create" 
            element={
              <ProtectedRoute roles={['artist']}>
                <CreateCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog/create" 
            element={
              <ProtectedRoute roles={['artist']}>
                <CreateBlogPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat/:recipientId" // Change this from "/chat"
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
          <Route 
            path="/artworks/create" 
            element={
              <ProtectedRoute roles={['artist']}> {/* <-- ONLY artists can access this */}
                <CreateArtworkPage />
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