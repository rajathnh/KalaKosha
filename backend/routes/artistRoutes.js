// routes/artistRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllArtists,
  getSingleArtistProfile,
} = require('../controllers/artistController');

// Public route to get a list of all artists
router.route('/').get(getAllArtists);

// Public route to get a single artist's full profile page data
router.route('/:id').get(getSingleArtistProfile);

module.exports = router;