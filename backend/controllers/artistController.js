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
    const { search, specialization, sort } = req.query;

    const queryObject = {};

    // Searching by artist name or in their bio
    if (search) {
        queryObject.$or = [
            { name: { $regex: search, $options: 'i' } },
            { bio: { $regex: search, $options: 'i' } }
        ];
    }
    // Filtering by their specialization
    if (specialization && specialization !== 'all') {
        // Finds artists where the specialization array contains the specified value
        queryObject.specialization = specialization;
    }

    let result = Artist.find(queryObject).select('-password'); // Exclude password from results

    // Sorting logic
    if (sort === 'a-z') {
        result = result.sort('name');
    }
    if (sort === 'z-a') {
        result = result.sort('-name');
    }
    if (sort === 'top-rated') {
        result = result.sort('-averageRating'); // Sort by the rating we calculate
    }
    if (sort === 'newest') {
        result = result.sort('-createdAt');
    }

    // Pagination logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const artists = await result;

    const totalArtists = await Artist.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalArtists / limit);

    res.status(StatusCodes.OK).json({ artists, count: artists.length, totalArtists, numOfPages });
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