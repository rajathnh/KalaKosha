// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController');

// All routes here are protected
router.use(authenticateUser);

router.route('/me').get(showCurrentUser);
router.route('/update-user').patch(updateUser);
router.route('/update-password').patch(updateUserPassword);

module.exports = router;