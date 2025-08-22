// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    getOrCreateConversation,
    sendMessage,
    getMessages,
} = require('../controllers/chatController');

// All chat routes require a logged-in user
router.use(authenticateUser);

// Route to start/find a conversation with another user
router.route('/conversations').post(getOrCreateConversation);

// Routes to handle messages within a specific conversation
router.route('/conversations/:conversationId/messages')
    .post(sendMessage) // Send a new message
    .get(getMessages);  // Get all messages (for polling)

module.exports = router;