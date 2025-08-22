// controllers/commissionReviewController.js
const CommissionReview = require('../models/CommissionReview');
const Commission = require('../models/Commission');
const Artist = require('../models/Artist');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const mongoose = require('mongoose');
const { checkPermissions } = require('../utils');


// --- HELPER FUNCTION ---
// This function calculates the average rating and number of reviews for an artist
// and updates their profile. It's called after a review is created, updated, or deleted.
const updateArtistRating = async (artistId) => {
    // The aggregate pipeline is a powerful way to perform calculations in MongoDB
    const result = await CommissionReview.aggregate([
        { $match: { artist: new mongoose.Types.ObjectId(artistId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        // Find the artist and update their rating fields
        // If the result array is empty (no reviews), default to 0.
        await Artist.findOneAndUpdate({ _id: artistId }, {
            averageRating: result.length > 0 ? Math.ceil(result[0].averageRating * 10) / 10 : 0,
            numOfReviews: result.length > 0 ? result[0].numOfReviews : 0,
        });
    } catch (error) {
        // Log any errors, but don't crash the request
        console.error('Failed to update artist rating:', error);
    }
};


// --- CREATE A NEW COMMISSION REVIEW ---
// This is called by the customer after a commission is marked 'Completed'
const createCommissionReview = async (req, res) => {
    const { commissionId, rating, comment } = req.body;
    const customerId = req.user.userId;

    const commission = await Commission.findOne({ _id: commissionId });
    if (!commission) {
        throw new CustomError.NotFoundError(`No commission with id: ${commissionId}`);
    }

    // --- SECURITY CHECKS ---
    // 1. Ensure the commission is actually completed
    if (commission.status !== 'Completed') {
        throw new CustomError.BadRequestError('Cannot review a commission that is not completed.');
    }
    // 2. Ensure the person leaving the review is the customer for that commission
    if (commission.customer.toString() !== customerId) {
        throw new CustomError.UnauthorizedError('You are not authorized to review this commission.');
    }
    // 3. Ensure a review hasn't already been submitted for this commission
    const alreadySubmitted = await CommissionReview.findOne({ commission: commissionId });
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError('Review already submitted for this commission.');
    }

    // All checks passed, create the review
    const review = await CommissionReview.create({
        rating,
        comment,
        artist: commission.artist,
        customer: customerId,
        commission: commissionId,
    });

    // CRITICAL STEP: Update the artist's rating after the new review is created
    await updateArtistRating(commission.artist);

    res.status(StatusCodes.CREATED).json({ review });
};


// --- GET ALL COMMISSION REVIEWS FOR A SPECIFIC ARTIST (Public) ---
// This is used for the artist's public profile page
const getArtistReviews = async (req, res) => {
    const { artistId } = req.params;
    const reviews = await CommissionReview.find({ artist: artistId })
        .sort('-createdAt') // Show newest reviews first
        .populate({ path: 'customer', select: 'name' }) // Show the reviewer's name
        .populate({ path: 'commission', select: 'title price' }); // Show context of what was reviewed
        
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};


// --- (Optional but Recommended) UPDATE and DELETE for Reviews ---

// --- UPDATE A REVIEW ---
const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await CommissionReview.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    // Check if the logged-in user is the author of the review
    checkPermissions(req.user, review.customer);

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // After updating, recalculate the artist's rating
    await updateArtistRating(review.artist);

    res.status(StatusCodes.OK).json({ review });
};

// --- DELETE A REVIEW ---
const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await CommissionReview.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    // Check permissions
    checkPermissions(req.user, review.customer);
    
    await review.deleteOne();
    
    // After deleting, recalculate the artist's rating
    await updateArtistRating(review.artist);

    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed.' });
};


module.exports = {
    createCommissionReview,
    getArtistReviews,
    updateReview,
    deleteReview,
};