// routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getCurrentArtistCourses
} = require('../controllers/courseController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('artist')], createCourse) // Only artists can create
  .get(getAllCourses); // Anyone can view all courses
router.route('/my-courses').get([authenticateUser, authorizePermissions('artist')], getCurrentArtistCourses);
router
  .route('/:id')
  .get(getSingleCourse) // Anyone can view a single course
  .patch([authenticateUser, authorizePermissions('artist')], updateCourse) // Only owner can update
  .delete([authenticateUser, authorizePermissions('artist')], deleteCourse); // Only owner can delete

module.exports = router;