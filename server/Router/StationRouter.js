const mongoose = require('mongoose');
const router = require('express').Router();
const { getAllStations,
  searchLocation,
  addStation,
  updateStation,
  deleteStation } = require('../controller/StationController');

// Routes
router.get('/stations', getAllStations);
router.get('/search-location', searchLocation);
router.post('/stations', addStation);
router.post('/stations/upload', addStation);
router.put('/stations/:id', updateStation);
router.delete('/stations/:id', deleteStation);


// router.get('/api/search-location', stationController.searchLocation);


module.exports = router;