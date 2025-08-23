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

router.route('/').post(authenticateUser, createReview);

// Route to get all reviews for a specific item (this is generic but specific in its own way)
router.route('/:onModel/:itemId').get(getReviewsForItem);

// Route to manage a SINGLE review by its own ID (this is the most generic)
router.route('/:id')
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;