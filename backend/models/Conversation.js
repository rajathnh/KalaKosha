// models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    required: true,
    // --- THIS IS THE CRITICAL CHANGE ---
    refPath: 'participantModels' 
  }],
  participantModels: [{
      type: String,
      required: true,
      enum: ['User', 'Artist'],
  }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);