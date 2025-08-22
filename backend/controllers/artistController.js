// controllers/artistController.js
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

// --- GET ALL ARTISTS (Public) ---
// For a public directory of all artists
const getAllArtists = async (req, res) => {
  // We only send back limited info for the list view
  const artists = await Artist.find({}).select('name profilePicture specialization');
  res.status(StatusCodes.OK).json({ artists, count: artists.length });
};

// --- GET SINGLE ARTIST'S PUBLIC PROFILE (Public) ---
// This aggregates all content related to a single artist
const getSingleArtistProfile = async (req, res) => {
  const { id: artistId } = req.params;

  // 1. Fetch the core artist details first
  const artist = await Artist.findOne({ _id: artistId }).select('-password');
  if (!artist) {
    throw new CustomError.NotFoundError(`No artist with id: ${artistId}`);
  }

  // 2. Use Promise.all to fetch all related content in parallel for performance
  const artworksPromise = Artwork.find({ artist: artistId });
  const coursesPromise = Course.find({ artist: artistId });
  const blogPostsPromise = BlogPost.find({ artist: artistId }).sort('-createdAt');

  const [artworks, courses, blogPosts] = await Promise.all([
    artworksPromise,
    coursesPromise,
    blogPostsPromise,
  ]);

  // 3. Combine everything into a single response object
  const profileData = {
    artist,
    artworks,
    courses,
    blogPosts,
  };

  res.status(StatusCodes.OK).json({ profile: profileData });
};

module.exports = {
  getAllArtists,
  getSingleArtistProfile,
};