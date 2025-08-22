// controllers/reviewController.js
const Review = require('../models/Review');
const Artwork = require('../models/Artwork');
const Course = require('../models/Course');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// Helper to update the average rating on a product
const updateAverageRating = async (modelName, reviewableId) => {
    const Model = mongoose.model(modelName);
    const result = await Review.aggregate([
        { $match: { reviewable: new mongoose.Types.ObjectId(reviewableId), onModel: modelName } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        await Model.findOneAndUpdate({ _id: reviewableId }, {
            averageRating: result.length > 0 ? Math.ceil(result[0].averageRating * 10) / 10 : 0,
            numOfReviews: result.length > 0 ? result[0].numOfReviews : 0,
        });
    } catch (error) {
        console.error('Failed to update average rating:', error);
    }
};


// --- CREATE A NEW REVIEW ---
const createReview = async (req, res) => {
    const { onModel, reviewable: reviewableId, rating, title, comment } = req.body;

    // We only apply this logic for Artworks for now. Courses can have a different logic (e.g., enrollment).
    if (onModel === 'Artwork') {
        // --- VERIFICATION STEP ---
        // Find an order item that matches the artwork AND was part of an order made by this user.
        const hasPurchased = await OrderItem.findOne({
            artwork: reviewableId,
            'order.user': req.user.userId, // This assumes you populate the user in the order query, or do a two-step query
        });

        // A more robust way to check:
        const order = await Order.findOne({ 'user': req.user.userId, 'status': 'delivered' });
        if (!order) {
            throw new CustomError.UnauthorizedError('You must purchase and receive an item to review it.');
        }
        const hasPurchasedItem = await OrderItem.findOne({ order: order._id, artwork: reviewableId });

        if (!hasPurchasedItem) {
            throw new CustomError.UnauthorizedError('You can only review artworks you have purchased.');
        }
    }
    // You could add similar logic for 'Course' based on an Enrollment model later.

    const Model = onModel === 'Artwork' ? Artwork : Course;
    const isValidProduct = await Model.findOne({ _id: reviewableId });
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No ${onModel.toLowerCase()} with id: ${reviewableId}`);
    }

    const alreadySubmitted = await Review.findOne({
        onModel,
        reviewable: reviewableId,
        user: req.user.userId,
    });
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError('Already submitted review for this product');
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    await updateAverageRating(onModel, reviewableId);

    res.status(StatusCodes.CREATED).json({ review });
};

// --- GET ALL REVIEWS FOR A SPECIFIC ITEM ---
const getReviewsForItem = async (req, res) => {
    const { onModel, itemId } = req.params;
    const reviews = await Review.find({ onModel: onModel, reviewable: itemId }).populate({
        path: 'user',
        select: 'name'
    });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};


// --- UPDATE A REVIEW ---
const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    await updateAverageRating(review.onModel, review.reviewable);

    res.status(StatusCodes.OK).json({ review });
};


// --- DELETE A REVIEW ---
const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);
    await review.deleteOne();
    
    await updateAverageRating(review.onModel, review.reviewable);

    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};


module.exports = {
    createReview,
    getReviewsForItem,
    updateReview,
    deleteReview,
};