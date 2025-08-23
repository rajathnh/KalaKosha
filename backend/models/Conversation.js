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
ConversationSchema.pre('save', function(next) {
  if (this.isNew) { // Only run this hook for new documents
    this.participants.sort();
  }
  next();
});

// Create a unique compound index on the sorted participants array.
// This will make it impossible for the database to store a duplicate conversation
// between the same two people.
ConversationSchema.index({ participants: 1 }, { unique: true });
module.exports = mongoose.model('Conversation', ConversationSchema);