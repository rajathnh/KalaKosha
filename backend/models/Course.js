// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    coverImage: {
      type: String,
      required: [true, 'Please provide a cover image URL for the course'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price for the course'],
      default: 0,
    },
    artForm: {
      type: String,
      required: [true, 'Please specify the art form being taught'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    // The link to the artist teaching the course
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);