// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    createReview,
    getReviewsForItem,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');

// General route to create any review
router.route('/').post(authenticateUser, createReview);

// Routes to update/delete a specific review by its ID
router.route('/:id')
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

// Route to get all reviews for a specific item (artwork or course)
router.route('/:onModel/:itemId').get(getReviewsForItem);

module.exports = router;