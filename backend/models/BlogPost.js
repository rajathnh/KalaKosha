// models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your blog post'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog post content cannot be empty'],
    },
    featuredImage: {
      type: String,
      required: [true, 'Please provide a featured image URL'],
    },
    tags: {
      type: [String],
      default: [],
    },
    // The link to the artist who wrote the post
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
  },
  { timestamps: true }
);
BlogPostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

// To include virtuals when we convert a document to JSON
BlogPostSchema.set('toJSON', { virtuals: true });
BlogPostSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('BlogPost', BlogPostSchema);