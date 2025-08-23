// controllers/artworkController.js
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { checkPermissions } = require('../utils');
const mongoose = require('mongoose');

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
// --- CREATE ARTWORK (Artist only) ---


const createArtwork = async (req, res) => {
  // The artist's ID is attached to the request by our authentication middleware
  req.body.artist = req.user.userId;

  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError('No image file uploaded');
  }

  const artworkImage = req.files.image;
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(artworkImage.tempFilePath, {
    use_filename: true,
    folder: 'kalakosha-artworks',
  });
  fs.unlinkSync(artworkImage.tempFilePath); // Clean up temp file

  req.body.image = result.secure_url;

  const artwork = await Artwork.create(req.body);
  await checkAndSetVerifiedBadge(req.user.userId);
  res.status(StatusCodes.CREATED).json({ artwork });
};

// --- GET ALL ARTWORKS (Public) ---
const getAllArtworks = async (req, res) => {
  const { search, artForm, sort } = req.query;

  const queryObject = {};

  if (search) {
    // Search by title or description (case-insensitive)
    queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (artForm && artForm !== 'all') {
    queryObject.artForm = artForm;
  }

  let result = Artwork.find(queryObject).populate({
    path: 'artist',
    select: 'name profilePicture',
  });

  // Sorting
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'price-lowest') {
    result = result.sort('price');
  }
  if (sort === 'price-highest') {
    result = result.sort('-price');
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12; // 12 items per page
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const artworks = await result;

  // Get total count for pagination on the frontend
  const totalArtworks = await Artwork.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalArtworks / limit);

  res.status(StatusCodes.OK).json({ artworks, count: artworks.length, totalArtworks, numOfPages });
};

// --- GET SINGLE ARTWORK (Public) ---
const getSingleArtwork = async (req, res) => {
  const { id: artworkId } = req.params;
  const artwork = await Artwork.findOne({ _id: artworkId }).populate({
    path: 'artist',
    select: 'name profilePicture bio specialization',
  });

  if (!artwork) {
    throw new CustomError.NotFoundError(`No artwork with id: ${artworkId}`);
  }
  res.status(StatusCodes.OK).json({ artwork });
};

// --- UPDATE ARTWORK (Artist owner only) ---
const updateArtwork = async (req, res) => {
  const { id: artworkId } = req.params;
  const artwork = await Artwork.findOne({ _id: artworkId });

  if (!artwork) {
    throw new CustomError.NotFoundError(`No artwork with id: ${artworkId}`);
  }

  // Check Permissions: Ensure the logged-in artist is the one who created the artwork
  checkPermissions(req.user, artwork.artist);

  // Update the fields. Note: We're not handling image updates here for simplicity, only text fields.
  const updatedArtwork = await Artwork.findOneAndUpdate({ _id: artworkId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ artwork: updatedArtwork });
};

// --- DELETE ARTWORK (Artist owner only) ---
const deleteArtwork = async (req, res) => {
  const { id: artworkId } = req.params;
  const artwork = await Artwork.findOne({ _id: artworkId });

  if (!artwork) {
    throw new CustomError.NotFoundError(`No artwork with id: ${artworkId}`);
  }
  
  // Check Permissions
  checkPermissions(req.user, artwork.artist);
  const artistId = artwork.artist;
  await artwork.deleteOne(); // Mongoose V6+
  await checkAndSetVerifiedBadge(artistId);
  res.status(StatusCodes.OK).json({ msg: 'Success! Artwork removed.' });
};
const getCurrentArtistArtworks = async (req, res) => {
    // Log the user ID we are receiving from the token middleware
    console.log(`[my-artworks] Fetching artworks for artist ID: ${req.user.userId}`);
    
    const artistId = req.user.userId;

    // --- THIS IS THE MOST ROBUST WAY TO QUERY ---
    // Even if artistId is a string, Mongoose will handle the cast to ObjectId here.
    // If it fails, it will throw a catchable error.
    try {
        const artworks = await Artwork.find({ artist: artistId }).sort('-createdAt');
        
        // Log what the database returned
        console.log(`[my-artworks] Mongoose query found ${artworks.length} artworks.`);
        
        res.status(StatusCodes.OK).json({ artworks, count: artworks.length });

    } catch (error) {
        // This will catch any errors if the ID is malformed or another DB issue occurs
        console.error('[my-artworks] An error occurred during the database query:', error);
        throw new CustomError.InternalServerError('Failed to fetch artworks.');
    }
};
module.exports = {
  createArtwork,
  getAllArtworks,
  getSingleArtwork,
  updateArtwork,
  deleteArtwork,
  getCurrentArtistArtworks
};