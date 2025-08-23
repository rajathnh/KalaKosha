// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { // The user who receives the notification
    type: mongoose.Schema.ObjectId,
    refPath: 'userModel',
    required: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Artist'],
  },
  message: { // The notification text, e.g., "Priya Patel left a review..."
    type: String,
    required: true,
  },
  link: { // The URL to navigate to on click, e.g., /artworks/123
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);