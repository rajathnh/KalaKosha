// routes/blogPostRoutes.js
const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogPostController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('artist')], createBlogPost)
  .get(getAllBlogPosts);

router
  .route('/:id')
  .get(getSingleBlogPost)
  .patch([authenticateUser, authorizePermissions('artist')], updateBlogPost)
  .delete([authenticateUser, authorizePermissions('artist')], deleteBlogPost);

module.exports = router;