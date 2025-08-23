// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
  getUserNotifications,
  markNotificationsAsRead,
} = require('../controllers/notificationController');

router.use(authenticateUser); // All routes here are protected

router.route('/').get(getUserNotifications);
router.route('/read').patch(markNotificationsAsRead);

module.exports = router;