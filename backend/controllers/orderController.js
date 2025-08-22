// controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Artwork = require('../models/Artwork');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review'); 
// --- (ADMIN ONLY) GET ALL ORDERS ---
const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};


// --- GET SINGLE ORDER ---
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }

    // Security check: ensure user is admin or owner of the order
    checkPermissions(req.user, order.user);

    // Also fetch the items associated with this order
    const orderItems = await OrderItem.find({ order: orderId });

    res.status(StatusCodes.OK).json({ order, orderItems });
};


// --- GET CURRENT USER'S ORDER HISTORY ---
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};


// --- CREATE ORDER ---
const createOrder = async (req, res) => {
    const { items: cartItems, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided');
    }

    let orderItems = [];
    let subtotal = 0;
    const courseItemsForEnrollment = []; // To create enrollments later

    for (const item of cartItems) {
        let dbProduct;
        // The frontend must now send a 'type' for each cart item
        if (item.type === 'Artwork') {
            dbProduct = await Artwork.findOne({ _id: item.productId });
            if (!dbProduct) throw new CustomError.NotFoundError(`No artwork with id: ${item.productId}`);
            if (dbProduct.status === 'Sold') throw new CustomError.BadRequestError(`Artwork "${dbProduct.title}" is sold.`);
        } else if (item.type === 'Course') {
            dbProduct = await Course.findOne({ _id: item.productId });
            if (!dbProduct) throw new CustomError.NotFoundError(`No course with id: ${item.productId}`);
            
            // Check if user is already enrolled
            const alreadyEnrolled = await Enrollment.findOne({ user: req.user.userId, course: dbProduct._id });
            if (alreadyEnrolled) throw new CustomError.BadRequestError(`You are already enrolled in "${dbProduct.title}".`);
            
            courseItemsForEnrollment.push(dbProduct._id);
        } else {
            throw new CustomError.BadRequestError(`Invalid item type: ${item.type}`);
        }

        const { title, price, _id } = dbProduct;
        const image = dbProduct.image || dbProduct.coverImage; // Use correct image field

        const singleOrderItem = {
            title, image, price,
            product: _id,
            onModel: item.type,
        };
        
        orderItems.push(singleOrderItem);
        subtotal += price;
    }

    const total = subtotal + (shippingFee || 0);
    const paymentIntentId = 'mock_payment_id_' + Math.random();

    const order = await Order.create({ total, user: req.user.userId, paymentIntentId, status: 'paid' });

    const finalOrderItems = orderItems.map(item => ({ ...item, order: order._id }));
    await OrderItem.insertMany(finalOrderItems);
    
    // --- Post-Order Actions ---
    // Mark artworks as 'Sold'
    for (const item of finalOrderItems) {
        if (item.onModel === 'Artwork') {
            await Artwork.findOneAndUpdate({ _id: item.product }, { status: 'Sold' });
        }
    }
    // Create enrollment records for courses
    for (const courseId of courseItemsForEnrollment) {
        await Enrollment.create({ user: req.user.userId, course: courseId, order: order._id });
    }
    
    res.status(StatusCodes.CREATED).json({ order });
};
// In backend/controllers/orderController.js

const checkPurchaseStatus = async (req, res) => {
    const { productId, productType } = req.params;
    const { userId } = req.user;

    let hasPurchased = false;
    let hasReviewed = false;

    // 1. Check for purchase first
    const userOrders = await Order.find({ user: userId, status: { $in: ['paid', 'delivered'] } });
    if (userOrders.length > 0) {
        const orderIds = userOrders.map(order => order._id);
        const orderItem = await OrderItem.findOne({ 
            order: { $in: orderIds },
            product: productId,
            onModel: productType,
        });
        if (orderItem) {
            hasPurchased = true;
        }
    }

    // 2. If they have purchased, now check if they have also reviewed
    if (hasPurchased) {
        const existingReview = await Review.findOne({
            user: userId,
            reviewable: productId,
            onModel: productType,
        });
        if (existingReview) {
            hasReviewed = true;
        }
    }

    // 3. Return both statuses
    res.status(StatusCodes.OK).json({ hasPurchased, hasReviewed });
};
// We export all functions now
module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    checkPurchaseStatus
};