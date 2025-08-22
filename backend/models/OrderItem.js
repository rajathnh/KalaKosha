// models/OrderItem.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    // This is the new polymorphic link
    product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Artwork', 'Course'],
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true,
    }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);