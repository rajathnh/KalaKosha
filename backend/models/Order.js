// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    paymentIntentId: { type: String }, // From payment gateway like Stripe
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'delivered', 'cancelled'],
        default: 'pending',
    },
    // The user who made the purchase
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);