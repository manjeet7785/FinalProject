const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking } = require('../controller/BookingController');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Create new booking (protected route)
router.post('/create', auth, createBooking);

// Get all user's bookings (protected route)
router.get('/my-bookings', auth, getUserBookings);

// Get single booking by ID (protected route)
router.get('/:id', auth, getBookingById);

// Cancel booking (protected route)
router.put('/cancel/:id', auth, cancelBooking);

module.exports = router;
