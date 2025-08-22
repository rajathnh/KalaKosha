// models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Comment cannot be more than 2000 characters'],
    },
    // The user who wrote the comment (can be a 'customer' or an 'artist')
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // We link to 'User' because any logged-in user can comment
      required: true,
    },
    // The blog post this comment is attached to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
    },
    // For threaded replies: this links to the parent comment
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // A top-level comment has no parent
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);