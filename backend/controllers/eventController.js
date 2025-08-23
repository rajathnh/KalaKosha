// controllers/eventController.js
const Event = require('../models/Event');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// GET ALL EVENTS (Public)
const getAllEvents = async (req, res) => {
  const events = await Event.find({ startTime: { $gte: new Date() } }) // Only show upcoming events
    .sort('startTime')
    .populate({ path: 'host', select: 'name profilePicture' });
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

// GET SINGLE EVENT (Public)
const getSingleEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOne({ _id: eventId })
    .populate({ path: 'host', select: 'name profilePicture' });
  if (!event) {
    throw new CustomError.NotFoundError(`No event with id: ${eventId}`);
  }
  res.status(StatusCodes.OK).json({ event });
};

// CREATE EVENT (Artist Only)
const createEvent = async (req, res) => {
  req.body.host = req.user.userId;

  if (!req.files || !req.files.eventImage) {
    throw new CustomError.BadRequestError('Please upload an event image.');
  }

  const result = await cloudinary.uploader.upload(req.files.eventImage.tempFilePath, {
    use_filename: true,
    folder: 'kalakosha-events',
  });
  fs.unlinkSync(req.files.eventImage.tempFilePath);
  req.body.eventImage = result.secure_url;

  const event = await Event.create(req.body);
  res.status(StatusCodes.CREATED).json({ event });
};
const getMyHostedEvents = async (req, res) => {
  const events = await Event.find({ host: req.user.userId }).sort('-startTime');
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

const registerForEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = req.user;

  // Use findOneAndUpdate to atomically add the user to the attendees array
  // The '$addToSet' operator ensures a user cannot be added more than once.
  const event = await Event.findOneAndUpdate(
    { _id: eventId },
    { $addToSet: { attendees: userId } }, // This prevents duplicate registrations
    { new: true, runValidators: true }
  );

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id: ${eventId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Successfully registered for the event!', event });
};

// GET USER'S REGISTERED EVENTS (UPDATED - NO LONGER FAKED)
const getMyRegisteredEvents = async (req, res) => {
  // Find all events where the 'attendees' array contains the current user's ID
  const events = await Event.find({ attendees: req.user.userId })
    .sort('startTime')
    .populate({ path: 'host', select: 'name profilePicture' });

  res.status(StatusCodes.OK).json({ events, count: events.length });
};

module.exports = {
  getAllEvents,
  getSingleEvent,
  createEvent,
  getMyHostedEvents, 
  registerForEvent,      // <-- ADD THIS
  getMyRegisteredEvents,
};