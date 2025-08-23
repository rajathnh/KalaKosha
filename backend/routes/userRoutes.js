// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    showCurrentUser,
    updateUser,
    updateUserPassword,
    getSingleUser // <-- Import the new controller
} = require('../controllers/userController');

// All routes here are protected
router.use(authenticateUser);

router.route('/me').get(showCurrentUser);
router.route('/update-user').patch(updateUser);
router.route('/update-password').patch(updateUserPassword);

// Add this new route. It should be placed after more specific routes like '/me'
// to avoid conflicts. It will handle requests like GET /api/v1/users/some_user_id
router.route('/:id').get(getSingleUser);


module.exports = router;