// controllers/commissionController.js
const Commission = require('../models/Commission');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// --- ARTIST CREATES A COMMISSION OFFER ---
const createCommission = async (req, res) => {
    const { customerId, conversationId, title, description, price } = req.body;
    
    // The artist is the logged-in user
    req.body.artist = req.user.userId;
    req.body.customer = customerId;
    req.body.conversationId = conversationId;

    const commission = await Commission.create(req.body);
    res.status(StatusCodes.CREATED).json({ commission });
};

// --- GET ALL COMMISSIONS FOR A CONVERSATION (for polling) ---
const getCommissionsForConversation = async (req, res) => {
    const { conversationId } = req.params;
    const commissions = await Commission.find({ conversationId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ commissions, count: commissions.length });
};

// --- CUSTOMER ACCEPTS THE OFFER ---
const acceptCommission = async (req, res) => {
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });

    if (!commission) {
        throw new CustomError.NotFoundError(`No commission with id: ${commissionId}`);
    }
    
    // Security Check: Only the intended customer can accept
    checkPermissions(req.user, commission.customer);

    // TODO: Integrate Payment Gateway here. Only proceed if payment is successful.

    commission.status = 'Accepted'; // Or 'InProgress'
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};

// --- ARTIST MARKS AS COMPLETE ---
const markAsCompleteByArtist = async (req, res) => {
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });

    if (!commission) { throw new CustomError.NotFoundError('Commission not found'); }
    
    // Security Check: Only the artist of this commission can mark it complete
    checkPermissions(req.user, commission.artist);
    
    commission.status = 'ArtistMarkedComplete';
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};

// --- CUSTOMER CONFIRMS COMPLETION ---
const confirmCompletionByCustomer = async (req, res) => {
    const { id: commissionId } = req.params;
    const commission = await Commission.findOne({ _id: commissionId });

    if (!commission) { throw new CustomError.NotFoundError('Commission not found'); }

    // Security Check: Only the customer can confirm
    checkPermissions(req.user, commission.customer);

    if (commission.status !== 'ArtistMarkedComplete') {
        throw new CustomError.BadRequestError('Cannot confirm completion before artist marks it as complete.');
    }

    commission.status = 'Completed';
    await commission.save();
    res.status(StatusCodes.OK).json({ commission });
};


module.exports = {
    createCommission,
    getCommissionsForConversation,
    acceptCommission,
    markAsCompleteByArtist,
    confirmCompletionByCustomer,
};