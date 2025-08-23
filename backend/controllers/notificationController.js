// controllers/notificationController.js
const Notification = require('../models/Notification');
const { StatusCodes } = require('http-status-codes');

// GET all notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.userId })
    .sort('-createdAt')
    .limit(15); // Only get the most recent ones
  res.status(StatusCodes.OK).json({ notifications });
};

// PATCH to mark all notifications as read
const markNotificationsAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user.userId, isRead: false },
    { isRead: true }
  );
  res.status(StatusCodes.OK).json({ msg: 'Notifications marked as read' });
};

module.exports = {
  getUserNotifications,
  markNotificationsAsRead,
};