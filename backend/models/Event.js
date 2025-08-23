// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please provide an event title'], maxlength: 100 },
  description: { type: String, required: [true, 'Please provide a description'] },
  eventImage: { type: String, required: [true, 'Please provide an image'] },
  host: { type: mongoose.Schema.ObjectId, ref: 'Artist', required: true },
  startTime: { type: Date, required: [true, 'Please provide a start time'] },
  eventType: {
    type: String,
    enum: ['Workshop', 'Exhibition', 'Talk', 'Q&A'],
    default: 'Talk',
  },
   attendees: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  price: { type: Number, default: 0 },
  meetingLink: { type: String }, // For virtual events
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);