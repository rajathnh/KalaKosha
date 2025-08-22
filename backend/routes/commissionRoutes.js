// routes/commissionRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {
    createCommission,
    getCommissionsForConversation,
    acceptCommission,
    markAsCompleteByArtist,
    confirmCompletionByCustomer,
} = require('../controllers/commissionController');

// All commission routes require a logged-in user
router.use(authenticateUser);

// Artist creates an offer
router.route('/').post(authorizePermissions('artist'), createCommission);

// Get all commission offers for a specific chat (for polling)
router.route('/conversation/:conversationId').get(getCommissionsForConversation);

// Customer accepts an offer
router.route('/:id/accept').post(authorizePermissions('customer'), acceptCommission);

// Artist marks as complete
router.route('/:id/artist-complete').patch(authorizePermissions('artist'), markAsCompleteByArtist);

// Customer confirms completion
router.route('/:id/customer-confirm').patch(authorizePermissions('customer'), confirmCompletionByCustomer);

module.exports = router;