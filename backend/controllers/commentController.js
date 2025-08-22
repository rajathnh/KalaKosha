// controllers/commentController.js
const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// --- CREATE A NEW COMMENT ---
const createComment = async (req, res) => {
    const { postId, content } = req.body;
    
    // The user ID comes from the authentication middleware
    req.body.author = req.user.userId;
    req.body.post = postId;

    // First, verify that the blog post actually exists
    const postExists = await BlogPost.findOne({ _id: postId });
    if (!postExists) {
        throw new CustomError.NotFoundError(`No blog post with id: ${postId}`);
    }

    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
};

// --- GET ALL COMMENTS FOR A BLOG POST (Public) ---
const getPostComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
        .populate({
            path: 'author',
            select: 'name' // Only show the commenter's name
        })
        .sort('createdAt'); // Sort oldest to newest to read like a conversation

    res.status(StatusCodes.OK).json({ comments, count: comments.length });
};

// --- UPDATE A COMMENT ---
const updateComment = async (req, res) => {
    const { id: commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
        throw new CustomError.NotFoundError(`No comment with id: ${commentId}`);
    }

    // Security Check: Only the author of the comment can edit it
    checkPermissions(req.user, comment.author);

    comment.content = content;
    await comment.save();

    res.status(StatusCodes.OK).json({ comment });
};

// --- DELETE A COMMENT ---
const deleteComment = async (req, res) => {
    const { id: commentId } = req.params;

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
        throw new CustomError.NotFoundError(`No comment with id: ${commentId}`);
    }

    // --- Advanced Permission Check ---
    // A comment can be deleted by EITHER its author OR the author of the blog post.
    const post = await BlogPost.findOne({ _id: comment.post });
    
    const isCommentAuthor = req.user.userId === comment.author.toString();
    const isPostAuthor = req.user.userId === post.artist.toString();

    if (!isCommentAuthor && !isPostAuthor) {
        throw new CustomError.UnauthorizedError('Not authorized to delete this comment');
    }

    await comment.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Comment removed.' });
};

module.exports = {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
};