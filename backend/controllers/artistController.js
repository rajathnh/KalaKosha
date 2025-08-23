// controllers/artistController.js
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const CommissionReview = require('../models/CommissionReview');
const mongoose = require('mongoose');
// --- GET ALL ARTISTS (Public) ---
// For a public directory of all artists

const checkAndSetVerifiedBadge = async (artistId) => {
  try {
    // 1. Count how many artworks this artist has.
    const artworkCount = await Artwork.countDocuments({ artist: artistId });

    // 2. Determine if the artist should be verified.
    const shouldBeVerified = artworkCount >= 3;

    // 3. Update the artist's profile with the new status.
    await Artist.findOneAndUpdate(
      { _id: artistId },
      { isVerified: shouldBeVerified }
    );
    
    console.log(`Verification check for artist ${artistId}: ${artworkCount} artworks. Verified status set to: ${shouldBeVerified}`);
  } catch (error) {
    // Log the error but don't crash the main request.
    // This is a background task, so it shouldn't block the user's action.
    console.error('Error updating artist verification status:', error);
  }
};
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

const getSingleArtistProfile = async (req, res) => {
  const { id: artistId } = req.params;

  // 1. Fetch the core artist details first
  const artist = await Artist.findOne({ _id: artistId }).select('-password');
  if (!artist) {
    throw new CustomError.NotFoundError(`No artist with id: ${artistId}`);
  }

  // --- THIS IS THE KEY FIX ---
  // We explicitly convert the artistId string to a Mongoose ObjectId before querying.
  // This removes any ambiguity and ensures the query is correct.
  const artistObjectId = new mongoose.Types.ObjectId(artistId);

  // 2. Use Promise.all to fetch all related content in parallel
  const artworksForSalePromise = Artwork.find({ artist: artistObjectId, status: 'For Sale' });
  const artworksSoldPromise = Artwork.find({ artist: artistObjectId, status: 'Sold' });
  // --- END OF FIX ---
  
  const coursesPromise = Course.find({ artist: artistObjectId });
  const commissionReviewsPromise = CommissionReview.find({ artist: artistObjectId })
        .populate({ path: 'customer', select: 'name' })
        .populate({ path: 'commission', select: 'title price' });

  const [artworksForSale, artworksSold, courses, commissionReviews] = await Promise.all([
    artworksForSalePromise,
    artworksSoldPromise,
    coursesPromise,
    commissionReviewsPromise,
  ]);
  
  // 3. Combine everything into a single response object
  const profileData = {
    artist,
    artworksForSale,
    artworksSold,
    courses,
    commissionReviews,
  };

  res.status(StatusCodes.OK).json({ profile: profileData });
};
module.exports = {
  getAllArtists,
  getSingleArtistProfile,
};