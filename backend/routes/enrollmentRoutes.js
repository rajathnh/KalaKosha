// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { getCurrentUserEnrollments } = require('../controllers/enrollmentController');

router.route('/my-enrollments').get(authenticateUser, getCurrentUserEnrollments);

module.exports = router;