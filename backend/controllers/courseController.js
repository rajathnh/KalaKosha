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
  const courses = await Course.find({}).populate({
    path: 'artist',
    select: 'name profilePicture', // Keep the list view lightweight
  });
  res.status(StatusCodes.OK).json({ courses, count: courses.length });
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