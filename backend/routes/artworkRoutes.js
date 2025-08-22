// routes/artworkRoutes.js
const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createArtwork,
  getAllArtworks,
  getSingleArtwork,
  updateArtwork,
  deleteArtwork,
} = require('../controllers/artworkController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('artist')], createArtwork) // Only artists can create
  .get(getAllArtworks); // Anyone can get all artworks

router
  .route('/:id')
  .get(getSingleArtwork) // Anyone can get a single artwork
  .patch([authenticateUser, authorizePermissions('artist')], updateArtwork) // Only artist owner can update
  .delete([authenticateUser, authorizePermissions('artist')], deleteArtwork); // Only artist owner can delete

module.exports = router;