// models/CommissionReview.js
const mongoose = require('mongoose');

const CommissionReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: 2000,
  },
  // The artist being reviewed
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Artist',
    required: true,
  },
  // The customer who wrote the review
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // The specific commission this review is for
  commission: {
    type: mongoose.Schema.ObjectId,
    ref: 'Commission',
    required: true,
    unique: true, // Ensures only one review per commission
  },
}, { timestamps: true });

module.exports = mongoose.model('CommissionReview', CommissionReviewSchema);