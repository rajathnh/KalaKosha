// models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // An array containing the IDs of the two participants
  participants: [{
    type: mongoose.Schema.ObjectId,
    required: true,
  }],
  // We can store references to know which model each participant belongs to
  participantModels: {
      type: [String],
      required: true,
      enum: ['User', 'Artist'],
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);