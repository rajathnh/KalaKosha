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
  getCurrentArtistBlogs
} = require('../controllers/blogPostController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('artist')], createBlogPost)
  .get(getAllBlogPosts);
router.route('/my-blogs').get([authenticateUser, authorizePermissions('artist')], getCurrentArtistBlogs);
router
  .route('/:id')
  .get(getSingleBlogPost)
  .patch([authenticateUser, authorizePermissions('artist')], updateBlogPost)
  .delete([authenticateUser, authorizePermissions('artist')], deleteBlogPost);

module.exports = router;