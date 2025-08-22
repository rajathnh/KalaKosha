// models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // --- THIS IS THE CORRECTED SCHEMA DEFINITION ---
  participants: {
    type: [mongoose.Schema.ObjectId], // Defines the field as an "Array of ObjectIds"
    required: true,                   // Makes the array itself required (cannot be empty or missing)
    ref: 'User', // A general reference, though we use participantModels to know the exact type
    
    // This custom validator is the most robust part.
    // It explicitly checks the business rule: "a conversation must have exactly two people."
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length === 2;
      },
      message: props => `A conversation must have exactly two participants.`
    }
  },
  // --- END OF CORRECTION ---

  participantModels: {
      type: [String],
      required: true,
      enum: ['User', 'Artist'],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: props => `participantModels must have exactly two entries.`
      }
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);