const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    default: 'Uttar Pradesh'
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['AC', 'DC', 'AC/DC'],
    default: 'AC'
  },
  capacity: {
    type: String,
    default: 'Not specified'
  },
  timing: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.0
  },
  facilities: {
    wifi: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    restroom: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    shop: { type: Boolean, default: false }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  source: {
    type: String,
    default: 'User Upload'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Station', StationSchema);
