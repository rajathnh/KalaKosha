const express = require("express");
const router = express.Router();

// --- Main Models & Middleware ---
const ForumMessage = require("../models/CommunityForum");
const { authenticateUser } = require('../middleware/authentication');

// --- Utilities ---
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const CustomError = require('../errors'); // Use your custom error classes

// GET /api/v1/forum - Retrieve all messages
// This can remain public for anyone to view the forum.
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ForumMessage.find({})
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'author',
            select: 'name profilePicture' // Populate author details for the UI
        })
        .lean(), // .lean() for better performance on read-only queries
      ForumMessage.countDocuments()
    ]);

    const hasMore = total > (page * limit);
    
    res.json({ messages, hasMore });
    
  } catch (error) {
    console.error("Error retrieving forum messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/v1/forum - Post a new message (PROTECTED)
// We add the `authenticateUser` middleware here.
router.post("/", authenticateUser, async (req, res) => {
  try {
    // 1. Get user info from the secure token, not the request body
    const { userId, name: userName, role } = req.user;
    const { message } = req.body;
    
    // 2. Validate that either a message or a file is present
    if (!message && (!req.files || !req.files.media)) {
      throw new CustomError.BadRequestError('A message or media file is required.');
    }

    let mediaUrl = null;
    let mediaType = null;

    // 3. Handle the file upload using express-fileupload
    if (req.files && req.files.media) {
      const mediaFile = req.files.media;

      // Basic validation for media type
      if (!mediaFile.mimetype.startsWith('image') && !mediaFile.mimetype.startsWith('video')) {
          throw new CustomError.BadRequestError('Only image and video files are allowed.');
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(mediaFile.tempFilePath, {
          folder: "kalakosha-forum-media",
          resource_type: "auto", // Let Cloudinary detect if it's an image or video
        });
        
        mediaUrl = result.secure_url;
        mediaType = result.resource_type; // 'image' or 'video'
        
        // Cleanup the temporary file from the server
        fs.unlinkSync(mediaFile.tempFilePath);
      } catch (uploadError) {
        // Ensure temp file is cleaned up even on upload failure
        fs.unlinkSync(mediaFile.tempFilePath);
        console.error("Cloudinary upload failed:", uploadError);
        throw new CustomError.InternalServerError('Media upload failed.');
      }
    }

    // 4. Create the new message document with the correct author reference
    const forumMessageData = { 
      author: userId,
      authorModel: role === 'artist' ? 'Artist' : 'User',
      userName, // Store for quick access, avoiding extra lookups
      message: message || '', // Ensure message is at least an empty string
      mediaUrl,
      mediaType
    };

    const forumMessage = await ForumMessage.create(forumMessageData);

    // Populate the newly created message to send back to the client
    const populatedMessage = await ForumMessage.findById(forumMessage._id)
      .populate({
        path: 'author',
        select: 'name profilePicture'
      });
      
    res.status(201).json({ 
      message: "Message posted successfully", 
      data: populatedMessage 
    });

  } catch (error) {
    // This will now be handled by your global error-handler middleware,
    // but we can log it here for debugging.
    console.error("Error posting forum message:", error);
    // Let the error handler middleware format the final response
    next(error); 
  }
});

module.exports = router;