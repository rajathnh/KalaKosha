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

CommissionSchema.virtual('review', {
  ref: 'CommissionReview', // The model to use
  localField: '_id',       // Find CommissionReview where...
  foreignField: 'commission', // ...the 'commission' field...
  justOne: true,           // ...matches this document's _id. We only expect one.
});

// Ensure virtuals are included when we convert the document to JSON
CommissionSchema.set('toJSON', { virtuals: true });
CommissionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Commission', CommissionSchema);