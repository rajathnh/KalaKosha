// controllers/userController.js
const User = require('../models/User');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// --- GET CURRENT LOGGED-IN USER ---
const showCurrentUser = async (req, res) => {
    // req.user is attached by our authentication middleware
    res.status(StatusCodes.OK).json({ user: req.user });
};

// --- GET A SINGLE USER'S PUBLIC PROFILE (NEW FUNCTION) ---
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ user });
};

// --- UPDATE USER/ARTIST DETAILS ---
const updateUser = async (req, res) => {
    const { name, email, bio } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email');
    }

    let user;
    if (req.user.role === 'artist') {
        // --- ARTIST-SPECIFIC LOGIC ---
        user = await Artist.findOne({ _id: req.user.userId });
        user.email = email;
        user.name = name;
        if (bio) {
            user.bio = bio;
        }

        // Handle profile picture update ONLY for artists
        if (req.files && req.files.profilePicture) {
            const profilePicFile = req.files.profilePicture;
            try {
                const result = await cloudinary.uploader.upload(profilePicFile.tempFilePath, {
                    use_filename: true,
                    folder: 'kalakosha-artists',
                    resource_type: 'image',
                });
                fs.unlinkSync(profilePicFile.tempFilePath);
                user.profilePicture = result.secure_url;
            } catch (error) {
                console.error('Artist profile picture update failed:', error);
            }
        }
    } else {
        // --- CUSTOMER-SPECIFIC LOGIC ---
        user = await User.findOne({ _id: req.user.userId });
        user.email = email;
        user.name = name;
        // No bio or profile picture logic here
    }

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};


// --- UPDATE USER/ARTIST PASSWORD ---
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both old and new passwords');
    }

    let user;
    if (req.user.role === 'artist') {
        user = await Artist.findOne({ _id: req.user.userId }).select('+password');
    } else {
        user = await User.findOne({ _id: req.user.userId }).select('+password');
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Old Password');
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password updated.' });
};

module.exports = { showCurrentUser, getSingleUser, updateUser, updateUserPassword };