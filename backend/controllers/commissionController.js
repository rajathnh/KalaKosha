// controllers/commissionController.js
const Commission = require('../models/Commission');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// --- ARTIST CREATES A COMMISSION OFFER ---
const createCommission = async (req, res) => {
    // ... (this function is correct, no changes)
    const { customerId, conversationId, title, description, price } = req.body;
    req.body.artist = req.user.userId;
    req.body.customer = customerId;
    req.body.conversationId = conversationId;
    const commission = await Commission.create(req.body);
    res.status(StatusCodes.CREATED).json({ commission });
};

// --- GET ALL COMMISSIONS FOR A CONVERSATION (for polling) ---
const getCommissionsForConversation = async (req, res) => {
    const { conversationId } = req.params;

    // --- THIS IS THE FIX ---
    // We need to populate the virtual 'review' field here.
    const commissions = await Commission.find({ conversationId })
        .populate('review') // <-- ADD THIS LINE
        .sort('createdAt');
    // --- END OF FIX ---
        
    res.status(StatusCodes.OK).json({ commissions, count: commissions.length });
};

// --- CUSTOMER ACCEPTS THE OFFER ---
const acceptCommission = async (req, res) => {
    // ... (this function is correct, no changes)
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });
    if (!commission) {
        throw new CustomError.NotFoundError(`No commission with id: ${commissionId}`);
    }
    checkPermissions(req.user, commission.customer);
    commission.status = 'Accepted';
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};

// --- ARTIST MARKS AS COMPLETE ---
const markAsCompleteByArtist = async (req, res) => {
    // ... (this function is correct, no changes)
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });
    if (!commission) { throw new CustomError.NotFoundError('Commission not found'); }
    checkPermissions(req.user, commission.artist);
    commission.status = 'ArtistMarkedComplete';
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};

// --- CUSTOMER CONFIRMS COMPLETION ---
const confirmCompletionByCustomer = async (req, res) => {
    // ... (this function is correct, no changes)
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });
    if (!commission) { throw new CustomError.NotFoundError('Commission not found'); }
    checkPermissions(req.user, commission.customer);
    if (commission.status !== 'ArtistMarkedComplete') {
        throw new CustomError.BadRequestError('Cannot confirm completion before artist marks it as complete.');
    }
    commission.status = 'Completed';
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};

// --- GET ALL COMMISSIONS FOR THE LOGGED-IN USER (for dashboard) ---
const getCurrentUserCommissions = async (req, res) => {
    // ... (this function is correct, no changes)
    const query = {};
    if (req.user.role === 'artist') {
        query.artist = req.user.userId;
    } else {
        query.customer = req.user.userId;
    }
    const commissions = await Commission.find(query)
        .populate({ path: 'artist', select: 'name' })
        .populate({ path: 'customer', select: 'name' })
        .populate('review')
        .sort('-updatedAt');
    res.status(StatusCodes.OK).json({ commissions, count: commissions.length });
};

// --- GET A SINGLE COMMISSION ---
const getSingleCommission = async (req, res) => {
    // ... (this function is correct, no changes)
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId })
        .populate({ path: 'artist', select: 'name' })
        .populate({ path: 'customer', select: 'name' });
    if (!commission) {
        throw new CustomError.NotFoundError(`No commission with id: ${commissionId}`);
    }
    const isArtist = commission.artist._id.equals(req.user.userId);
    const isCustomer = commission.customer._id.equals(req.user.userId);
    if (!isArtist && !isCustomer && req.user.role !== 'admin') {
        throw new CustomError.UnauthorizedError('Not authorized to access this commission');
    }
    res.status(StatusCodes.OK).json({ commission });
};


module.exports = {
    createCommission,
    getCommissionsForConversation,
    acceptCommission,
    markAsCompleteByArtist,
    confirmCompletionByCustomer,
    getCurrentUserCommissions,
    getSingleCommission,
};