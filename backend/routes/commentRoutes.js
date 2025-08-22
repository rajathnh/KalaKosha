// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

// --- Main Route for Creating Comments ---
// A logged-in user posts a comment to a specific blog post.
// POST /api/v1/comments
router.route('/').post(authenticateUser, createComment);

// --- Public Route for Fetching a Post's Comments ---
// Anyone can view all comments for a specific blog post.
// GET /api/v1/comments/post/:postId
router.route('/post/:postId').get(getPostComments);

// --- Protected Routes for Managing a Single Comment ---
// The comment's author (or post's author) can update or delete it.
// PATCH /api/v1/comments/:id
// DELETE /api/v1/comments/:id
router.route('/:id')
    .patch(authenticateUser, updateComment)
    .delete(authenticateUser, deleteComment);

module.exports = router;