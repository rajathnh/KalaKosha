const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  registerUser,
  registerArtist,
  login,
  logout,
} = require('../controllers/authController');

// --- Public Authentication Routes ---

// Route for a standard user (customer) to register
// POST /api/v1/auth/register/user
router.post('/register/user', registerUser);

// Route for an artist to register
// This will handle multipart/form-data because of the potential profile picture upload
// POST /api/v1/auth/register/artist
router.post('/register/artist', registerArtist);

// Route for any user (customer, artist, or admin) to log in
// POST /api/v1/auth/login
router.post('/login', login);

// Route to log out
// GET /api/v1/auth/logout
router.get('/logout', logout);

module.exports = router;