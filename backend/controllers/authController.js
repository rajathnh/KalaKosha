const User = require('../models/User');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// --- REGISTER A NEW USER (CUSTOMER) ---
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError('Please provide name, email, and password');
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already in use');
  }

  // First account created is an admin (optional, can be removed)
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'customer';

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};


// --- REGISTER A NEW ARTIST ---
const registerArtist = async (req, res) => {
  const { name, email, password, specialization, bio } = req.body;

  if (!name || !email || !password || !specialization || !bio) {
    throw new CustomError.BadRequestError('Please provide all required fields for an artist profile');
  }

  const emailAlreadyExists = await Artist.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already in use by an artist');
  }

  let profilePictureUrl = '/uploads/default-artist.png'; // Default value

  // Handle profile picture upload if one is provided
  if (req.files && req.files.profilePicture) {
    const profilePictureFile = req.files.profilePicture;
    try {
      const result = await cloudinary.uploader.upload(profilePictureFile.tempFilePath, {
        use_filename: true,
        folder: 'kalakosha-artists',
        resource_type: 'image',
      });
      profilePictureUrl = result.secure_url;
      fs.unlinkSync(profilePictureFile.tempFilePath); // Clean up temp file
    } catch (error) {
      // If upload fails, we can log the error but still proceed with default image
      console.error('Cloudinary upload failed:', error);
      throw new CustomError.InternalServerError('Image upload failed');
    }
  }

  // Convert specialization from comma-separated string to an array
  const specializationArray = specialization.split(',').map(skill => skill.trim());

  const artist = await Artist.create({
    name,
    email,
    password,
    specialization: specializationArray,
    bio,
    profilePicture: profilePictureUrl,
  });

  const tokenUser = createTokenUser(artist);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};


// --- LOGIN FOR BOTH USERS AND ARTISTS ---
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  // First, try to find an Artist
  let user = await Artist.findOne({ email }).select('+password');
  
  // If no artist is found, try to find a User
  if (!user) {
    user = await User.findOne({ email }).select('+password');
  }

  // If neither is found, the credentials are invalid
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // Use the comparePassword method from the respective model
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};


// --- LOGOUT ---
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};


module.exports = {
  registerUser,
  registerArtist,
  login,
  logout,
};