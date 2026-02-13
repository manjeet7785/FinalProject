const Booking = require('../Model/Booking');
const Station = require('../Model/Station');

// 1. Create Booking
const createBooking = async (req, res) => {
  try {
    const { stationId, bookingDate, bookingTime, duration, chargerType, notes, totalAmount, stationName, stationLocation } = req.body;
    const userId = req.user._id;

    console.log('Booking Request:', { stationId, bookingDate, bookingTime, duration, chargerType, userId });

    if (!stationId || !bookingDate || !bookingTime || !duration || !chargerType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate/normalize time format HH:MM
    const validTime = /^\d{1,2}:\d{2}$/;
    if (!validTime.test(bookingTime)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM' });
    }

    const [hhStr, mmStr] = bookingTime.split(':');
    const hh = Number(hhStr);
    const mm = Number(mmStr);
    if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
      return res.status(400).json({ message: 'Invalid time value. Use 00-23 for hours and 00-59 for minutes' });
    }

    // Combine date and time for overlap checks
    const dayOnly = new Date(bookingDate);
    const requestStart = new Date(dayOnly);
    requestStart.setHours(hh, mm, 0, 0);
    const requestEnd = new Date(requestStart.getTime() + (Number(duration) || 1) * 60 * 60 * 1000);

    // Try to find station by _id (ObjectId) or by custom id field
    let station = null;
    try {
      station = await Station.findById(stationId);
    } catch (err) {
      console.log('Station not found by ObjectId, trying custom id field');
      // If stationId is not a valid ObjectId, try finding by custom id field
      station = await Station.findOne({ id: stationId });
    }

    // If station is still not found, use the data provided from frontend
    const finalStationName = stationName || station?.name || 'Unknown Station';
    const finalStationLocation = stationLocation || station?.location || station?.district || 'Unknown Location';

    const ratePerHour = chargerType === 'DC' ? 200 : 100;
    const calculatedAmount = totalAmount || (ratePerHour * duration);

    // Overlap check within the same day
    const startOfDay = new Date(dayOnly);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dayOnly);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Booking.find({
      station: stationId,
      status: { $in: ['pending', 'confirmed'] },
      bookingDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const overlaps = existing.find((b) => {
      const bStart = new Date(b.bookingDate);
      const [bh, bm] = (b.bookingTime || '00:00').split(':').map(Number);
      bStart.setHours(bh || 0, bm || 0, 0, 0);
      const bEnd = new Date(bStart.getTime() + (Number(b.duration) || 1) * 60 * 60 * 1000);
      return requestStart < bEnd && requestEnd > bStart; // interval overlap
    });

    if (overlaps) {
      return res.status(409).json({
        message: 'Selected time slot is not available for this station',
        conflict: {
          from: overlaps.bookingTime,
          to: new Date(new Date(overlaps.bookingDate).setHours(Number((overlaps.bookingTime || '00:00').split(':')[0]) || 0, Number((overlaps.bookingTime || '00:00').split(':')[1]) || 0) + (Number(overlaps.duration) || 1) * 60 * 60 * 1000).toISOString()
        }
      });
    }

    const newBooking = new Booking({
      user: userId,
      station: stationId,
      stationName: finalStationName,
      stationLocation: finalStationLocation,
      bookingDate: new Date(bookingDate),
      bookingTime,
      duration,
      chargerType,
      totalAmount: calculatedAmount,
      notes: notes || '',
      status: 'confirmed'
    });

    console.log('Saving booking:', newBooking);

    await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });
  } catch (error) {
    console.error('❌ Booking Creation Error:', error.message);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// 3. Get Single Booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// 4. Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Cancel failed' });
  }
};

// --- CRITICAL FIX: Ensure all functions are exported correctly ---
module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};