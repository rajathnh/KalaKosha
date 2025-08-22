// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createOrder,
  getAllOrders,    // Optional: For admin use
  getSingleOrder,
  getCurrentUserOrders,
  checkPurchaseStatus
} = require('../controllers/orderController'); // We'll add these new functions to the controller


// --- Main Route for Creating and Viewing Orders ---

// A logged-in user creates an order.
// POST /api/v1/orders
router.route('/').post(authenticateUser, createOrder);


// An admin can view all orders in the system.
// GET /api/v1/orders
router.route('/').get([authenticateUser, authorizePermissions('admin')], getAllOrders);


// --- Route for the current logged-in user to see their own order history ---
// GET /api/v1/orders/my-orders
router.route('/my-orders').get(authenticateUser, getCurrentUserOrders);
router.route('/status/:productType/:productId').get(authenticateUser, checkPurchaseStatus);

// --- Route to view a single specific order ---
// A user can only view their own order, but an admin can view any.
// GET /api/v1/orders/:id
router.route('/:id').get(authenticateUser, getSingleOrder);


module.exports = router;