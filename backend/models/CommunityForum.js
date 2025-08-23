const mongoose = require("mongoose");

const forumMessageSchema = new mongoose.Schema({
  // --- START OF MODEL UPGRADE ---
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'authorModel' // This allows linking to either User or Artist
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['User', 'Artist']
  },
  // We keep userName for quick display, but the 'author' ref is the source of truth.
  userName: { type: String, required: true },
  // --- END OF MODEL UPGRADE ---

  message: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ["image", "video", null] }, // Allow null
  timestamp: { type: Date, default: Date.now },
});

// ... (toJSON settings)

module.exports = mongoose.model("ForumMessage", forumMessageSchema);