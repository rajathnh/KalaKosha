// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  // Text content is now optional
  content: {
    type: String,
    trim: true,
  },
  // New field for the image URL
  imageUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);