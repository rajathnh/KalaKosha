// routes/commissionReviewRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    createCommissionReview,
    getArtistReviews,
    updateReview,
    deleteReview,
} = require('../controllers/commissionReviewController');

// --- Main Route for Creating Reviews ---
// A logged-in user (customer) creates a review for a completed commission.
// POST /api/v1/commission-reviews
router.route('/').post(authenticateUser, createCommissionReview);

// --- Public Route for Fetching Reviews ---
// Anyone can view all the commission reviews for a specific artist.
// This is used on the artist's public profile page.
// GET /api/v1/commission-reviews/artist/:artistId
router.route('/artist/:artistId').get(getArtistReviews);

// --- Protected Routes for Managing a Single Review ---
// The user who wrote the review can update or delete it.
// The ':id' here refers to the ID of the review itself.
// PATCH /api/v1/commission-reviews/:id
// DELETE /api/v1/commission-reviews/:id
router.route('/:id')
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;