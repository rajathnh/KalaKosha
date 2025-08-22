// models/Commission.js
const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 2000 },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'Offered',
      'Accepted',
      'InProgress',
      'ArtistMarkedComplete',
      'Completed',
      'Cancelled'
    ],
    default: 'Offered',
  },
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist', required: true },
  customer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.ObjectId, ref: 'Conversation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Commission', CommissionSchema);