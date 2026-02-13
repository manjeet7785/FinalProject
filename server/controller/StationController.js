const Station = require('../Model/Station');

// Get all stations
const getAllStations = async (req, res) => {
  try {
    // Get static stations from file
    const staticStations = require('../API/Station');
    
    // Get user-uploaded stations from database
    const dbStations = await Station.find({});
    
    // Merge both arrays (database stations + static stations)
    const allStations = [...dbStations, ...staticStations];
    
    res.status(200).json(allStations);
  } catch (error) {
    console.error('Get Stations Error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

// Search location (Nominatim API के लिए)
const searchLocation = async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EVChargingApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
};

// Add/Upload new station
const addStation = async (req, res) => {
  try {
    const { name, district, state, location, latitude, longitude, type, capacity, timing, contact, email, rating, facilities } = req.body;

    // Validation
    if (!name || !district || !location || !latitude || !longitude || !timing || !contact) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if station already exists at same location
    const existingStation = await Station.findOne({
      latitude: { $gte: latitude - 0.001, $lte: latitude + 0.001 },
      longitude: { $gte: longitude - 0.001, $lte: longitude + 0.001 }
    });

    if (existingStation) {
      return res.status(400).json({ message: 'Station already exists at this location' });
    }

    const newStation = new Station({
      name,
      district,
      state: state || 'Uttar Pradesh',
      location,
      latitude,
      longitude,
      type: type || 'AC',
      capacity: capacity || 'Not specified',
      timing,
      contact,
      email: email || '',
      rating: rating || 4.0,
      facilities: facilities || {},
      uploadedBy: req.user?._id,
      source: 'User Upload'
    });

    await newStation.save();
    res.status(201).json({
      message: 'Station uploaded successfully! It will be verified soon.',
      station: newStation
    });
  } catch (error) {
    console.error('Add Station Error:', error);
    res.status(500).json({ message: 'Failed to upload station', error: error.message });
  }
};

// Update station
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const station = await Station.findByIdAndUpdate(id, updates, { new: true });
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.status(200).json({ message: 'Station updated successfully', station });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update station', error: error.message });
  }
};

// Delete station
const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findByIdAndDelete(id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.status(200).json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete station', error: error.message });
  }
};

module.exports = {
  getAllStations,
  searchLocation,
  addStation,
  updateStation,
  deleteStation
};