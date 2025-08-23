// controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { createNotification } = require('../utils/notificationUtils');
// --- START a conversation or GET existing one ---
const getOrCreateConversation = async (req, res) => {
    const { recipientId, recipientModel } = req.body; // e.g., Artist's ID
    const senderId = req.user.userId;
    const senderModel = req.user.role === 'artist' ? 'Artist' : 'User';

    // Find if a conversation already exists with these two participants
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
    });

    if (conversation) {
        return res.status(StatusCodes.OK).json({ conversation });
    }

    // If not, create a new one
    const newConversation = await Conversation.create({
        participants: [senderId, recipientId],
        participantModels: [senderModel, recipientModel],
    });

    res.status(StatusCodes.CREATED).json({ conversation: newConversation });
};


// --- SEND a message in a conversation ---
const sendMessage = async (req, res) => {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.userId;
    let imageUrl = null;

    // A message must have either text content or an image file
    if (!content && (!req.files || !req.files.image)) {
        throw new CustomError.BadRequestError('Message must contain either text or an image.');
    }

    // Handle image upload if a file is present
    if (req.files && req.files.image) {
        const imageFile = req.files.image;
        try {
            const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                use_filename: true,
                folder: 'kalakosha-chat-images', // A dedicated folder for chat images
                resource_type: 'image',
            });
            imageUrl = result.secure_url;
            fs.unlinkSync(imageFile.tempFilePath); // Clean up temp file
        } catch (error) {
            console.error('Chat image upload failed:', error);
            throw new CustomError.InternalServerError('Image upload failed');
        }
    }

    // Create the message document with either text, an image, or both
    const message = await Message.create({
        conversationId,
        senderId,
        content: content || '', // Ensure content is at least an empty string if not provided
        imageUrl,
    });
    const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    const recipient = conversation.participants.find(p => p.toString() !== req.user.userId);
    const recipientModelInfo = conversation.participantModels.find((m, i) => conversation.participants[i].toString() === recipient.toString());
    
    if (recipient && recipientModelInfo) {
      await createNotification(
        recipient,
        recipientModelInfo,
        `${req.user.name} sent you a message.`,
        `/chat/${req.user.userId}`
      );
    }
}

    res.status(StatusCodes.CREATED).json({ message });
};



// --- GET all messages for a conversation (This is the polling endpoint) ---
const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    
    const messages = await Message.find({ conversationId }).sort('createdAt');
    
    res.status(StatusCodes.OK).json({ messages, count: messages.length });
};

const getUserConversations = async (req, res) => {
    const userId = req.user.userId;

    const conversations = await Conversation.find({ participants: userId })
        .populate({
            path: 'participants',
            select: 'name profilePicture', // Get the other person's details
        })
        .sort('-updatedAt'); // Show most recent conversations first

    res.status(StatusCodes.OK).json({ conversations });
};
module.exports = {
    getOrCreateConversation,
    sendMessage,
    getMessages,
    getUserConversations
};