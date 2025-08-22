// controllers/blogPostController.js
const BlogPost = require('../models/BlogPost');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { checkPermissions } = require('../utils');

// --- CREATE BLOG POST (Artist only) ---
const createBlogPost = async (req, res) => {
  req.body.artist = req.user.userId;

  if (!req.files || !req.files.featuredImage) {
    throw new CustomError.BadRequestError('No featured image file uploaded');
  }

  const image = req.files.featuredImage;
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    folder: 'kalakosha-blogs',
  });
  fs.unlinkSync(image.tempFilePath);

  req.body.featuredImage = result.secure_url;

  // Handle tags if they are sent as a comma-separated string
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
  }

  const blogPost = await BlogPost.create(req.body);
  res.status(StatusCodes.CREATED).json({ blogPost });
};

// --- GET ALL BLOG POSTS (Public) ---
const getAllBlogPosts = async (req, res) => {
  // Sort by newest first
  const blogPosts = await BlogPost.find({}).sort('-createdAt').populate({
    path: 'artist',
    select: 'name profilePicture',
  });
  res.status(StatusCodes.OK).json({ blogPosts, count: blogPosts.length });
};

// --- GET SINGLE BLOG POST (Public) ---
const getSingleBlogPost = async (req, res) => {
  const { id: blogPostId } = req.params;
  const blogPost = await BlogPost.findOne({ _id: blogPostId }).populate({
    path: 'artist',
    select: 'name profilePicture bio',
  });

  if (!blogPost) {
    throw new CustomError.NotFoundError(`No blog post with id: ${blogPostId}`);
  }
  res.status(StatusCodes.OK).json({ blogPost });
};

// --- UPDATE BLOG POST (Artist owner only) ---
const updateBlogPost = async (req, res) => {
  const { id: blogPostId } = req.params;
  const blogPost = await BlogPost.findOne({ _id: blogPostId });

  if (!blogPost) {
    throw new CustomError.NotFoundError(`No blog post with id: ${blogPostId}`);
  }

  checkPermissions(req.user, blogPost.artist);
  
  // Handle tags update
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
  }

  const updatedBlogPost = await BlogPost.findOneAndUpdate({ _id: blogPostId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ blogPost: updatedBlogPost });
};

// --- DELETE BLOG POST (Artist owner only) ---
const deleteBlogPost = async (req, res) => {
  const { id: blogPostId } = req.params;
  const blogPost = await BlogPost.findOne({ _id: blogPostId });

  if (!blogPost) {
    throw new CustomError.NotFoundError(`No blog post with id: ${blogPostId}`);
  }

  checkPermissions(req.user, blogPost.artist);
  
  await blogPost.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Blog post removed.' });
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
};