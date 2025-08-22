// controllers/artworkController.js
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { checkPermissions } = require('../utils');

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
  res.status(StatusCodes.CREATED).json({ artwork });
};

// --- GET ALL ARTWORKS (Public) ---
const getAllArtworks = async (req, res) => {
  const artworks = await Artwork.find({}).populate({
    path: 'artist',
    select: 'name profilePicture', // Only show artist's name and picture
  });
  res.status(StatusCodes.OK).json({ artworks, count: artworks.length });
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
  
  await artwork.deleteOne(); // Mongoose V6+
  res.status(StatusCodes.OK).json({ msg: 'Success! Artwork removed.' });
};

module.exports = {
  createArtwork,
  getAllArtworks,
  getSingleArtwork,
  updateArtwork,
  deleteArtwork,
};