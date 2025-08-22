// models/Artwork.js
const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the artwork'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL for the artwork'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    artForm: {
      type: String,
      required: [true, 'Please specify the art form (e.g., Warli, Madhubani)'],
    },
    status: {
      type: String,
      enum: ['For Sale', 'Sold'],
      default: 'For Sale',
    },
    // This is the crucial link to the artist who owns this artwork
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', ArtworkSchema);