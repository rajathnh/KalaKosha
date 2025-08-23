// models/Artist.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const ArtistSchema = new mongoose.Schema(
  {
    // --- Core Identity Fields (like the User model) ---
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Prevents password from being sent in API responses
    },
    role: {
      type: String,
      default: 'artist', // Hardcoded for authorization purposes
    },

    // --- Artist-Specific Professional Fields ---
    profilePicture: {
      type: String,
      default: '/uploads/default-artist.png',
    },
    specialization: {
      type: [String],
      required: [true, 'Please specify at least one art form (e.g., Warli, Madhubani)'],
      default: [],
    },
    bio: {
      type: String,
      required: [true, 'Please provide a bio for your artist profile'],
      maxlength: 1000,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
        artworkBadgeTier: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    courseBadgeTier: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    blogBadgeTier: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
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

// --- Security Middleware (same as User model) ---

// Hash password before saving a new artist
ArtistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
ArtistSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('Artist', ArtistSchema);