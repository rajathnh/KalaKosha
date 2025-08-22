// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating between 1 and 5'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide a review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
    },
    // The user who wrote the review
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Any logged-in user can review
      required: true,
    },
    // The polymorphic relationship
    reviewable: {
      type: mongoose.Schema.ObjectId,
      required: true,
      // This 'ref' tells Mongoose which model to look in, based on 'onModel'
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Artwork', 'Course'], // The types of items that can be reviewed
    },
  },
  { timestamps: true }
);

// Prevent a user from leaving more than one review per item
ReviewSchema.index({ reviewable: 1, onModel: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);