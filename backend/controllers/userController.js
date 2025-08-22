// controllers/userController.js
const User = require('../models/User');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

// --- GET CURRENT LOGGED-IN USER ---
const showCurrentUser = async (req, res) => {
    // req.user is attached by our authentication middleware
    res.status(StatusCodes.OK).json({ user: req.user });
};


// --- UPDATE USER/ARTIST DETAILS ---
const updateUser = async (req, res) => {
    const { name, email, bio } = req.body; // Add any other fields you want to be updatable
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email');
    }

    let user;
    if (req.user.role === 'artist') {
        user = await Artist.findOne({ _id: req.user.userId });
    } else {
        user = await User.findOne({ _id: req.user.userId });
    }

    user.email = email;
    user.name = name;
    if (req.user.role === 'artist' && bio) {
        user.bio = bio;
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

module.exports = { showCurrentUser, updateUser, updateUserPassword };