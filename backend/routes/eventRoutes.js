// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {
  getAllEvents,
  getSingleEvent,
  createEvent,
  getMyHostedEvents,     // <-- Ensure this is imported
  getMyRegisteredEvents,
   registerForEvent,
} = require('../controllers/eventController');

router.route('/')
  .get(getAllEvents)
  .post([authenticateUser, authorizePermissions('artist')], createEvent);


router.route('/my-hosted').get([authenticateUser, authorizePermissions('artist')], getMyHostedEvents);

// Route for a user to get the events they are registered for
router.route('/my-registered').get(authenticateUser, getMyRegisteredEvents);
router.route('/:id').get(getSingleEvent);
router.route('/:id/register').post(authenticateUser, registerForEvent);
module.exports = router;