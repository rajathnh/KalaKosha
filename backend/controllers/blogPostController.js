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
    const { search, tags, sort } = req.query;

    const queryObject = {};

    // Searching by keyword in title or content
    if (search) {
        queryObject.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }
    // Filtering by a specific tag
    if (tags) {
        // This finds posts that include the specified tag in their tags array
        queryObject.tags = tags;
    }

    let result = BlogPost.find(queryObject).populate({
        path: 'artist',
        select: 'name profilePicture',
    });

    // Sorting logic (most common for blogs is by date)
    if (sort === 'latest' || !sort) { // Default to latest
        result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt');
    }

    // Pagination logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const blogPosts = await result;

    const totalBlogPosts = await BlogPost.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalBlogPosts / limit);

    res.status(StatusCodes.OK).json({ blogPosts, count: blogPosts.length, totalBlogPosts, numOfPages });
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