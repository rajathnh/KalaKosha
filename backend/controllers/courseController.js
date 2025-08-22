// controllers/courseController.js
const Course = require('../models/Course');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { checkPermissions } = require('../utils');

// --- CREATE COURSE (Artist only) ---
const createCourse = async (req, res) => {
  // Link the course to the logged-in artist
  req.body.artist = req.user.userId;

  if (!req.files || !req.files.coverImage) {
    throw new CustomError.BadRequestError('No cover image file uploaded');
  }

  // Upload the cover image to Cloudinary
  const courseImage = req.files.coverImage;
  const result = await cloudinary.uploader.upload(courseImage.tempFilePath, {
    use_filename: true,
    folder: 'kalakosha-courses',
  });
  fs.unlinkSync(courseImage.tempFilePath); // Clean up the temp file

  req.body.coverImage = result.secure_url;

  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json({ course });
};

// --- GET ALL COURSES (Public) ---
const getAllCourses = async (req, res) => {
    const { search, artForm, difficulty, sort } = req.query;

    const queryObject = {};

    // Searching by keyword in title or description
    if (search) {
        queryObject.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    // Filtering by art form
    if (artForm && artForm !== 'all') {
        queryObject.artForm = artForm;
    }
    // Filtering by difficulty
    if (difficulty && difficulty !== 'all') {
        queryObject.difficulty = difficulty;
    }

    let result = Course.find(queryObject).populate({
        path: 'artist',
        select: 'name profilePicture',
    });

    // Sorting logic
    if (sort === 'latest') {
        result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt');
    }
    if (sort === 'price-lowest') {
        result = result.sort('price');
    }
    if (sort === 'price-highest') {
        result = result.sort('-price');
    }

    // Pagination logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const courses = await result;

    // Get total count for frontend pagination
    const totalCourses = await Course.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalCourses / limit);

    res.status(StatusCodes.OK).json({ courses, count: courses.length, totalCourses, numOfPages });
};

// --- GET SINGLE COURSE (Public) ---
const getSingleCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findOne({ _id: courseId }).populate({
    path: 'artist',
    select: 'name profilePicture bio specialization', // Show more artist details
  });

  if (!course) {
    throw new CustomError.NotFoundError(`No course with id: ${courseId}`);
  }
  res.status(StatusCodes.OK).json({ course });
};

// --- UPDATE COURSE (Artist owner only) ---
const updateCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw new CustomError.NotFoundError(`No course with id: ${courseId}`);
  }

  // Check Permissions: Only the artist who created it can update it
  checkPermissions(req.user, course.artist);

  // Note: This simplified update does not handle changing the cover image.
  const updatedCourse = await Course.findOneAndUpdate({ _id: courseId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ course: updatedCourse });
};

// --- DELETE COURSE (Artist owner only) ---
const deleteCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw new CustomError.NotFoundError(`No course with id: ${courseId}`);
  }

  // Check Permissions
  checkPermissions(req.user, course.artist);

  await course.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Course removed.' });
};

module.exports = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};