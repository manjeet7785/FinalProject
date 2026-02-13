const Express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./Router/AuthRouter');
const stationRouter = require('./Router/StationRouter');
const bookingRouter = require('./Router/BookingRouter');

const app = Express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://695b7b41948bf4afce44988c--unique-croissant-f5d379.netlify.app'
  ],
  credentials: true
}));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());

const Port = process.env.PORT || process.env.Port || 4000;
const Mongo_URI = process.env.Mongo_URI;


app.use('/api/auth', authRouter);
app.use('/api', stationRouter);
app.use('/api/bookings', bookingRouter);

app.get('/api/stations', (req, res) => {
  try {
    const stations = require('./API/Station.js');
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

app.get('/api/search-location', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query required' });
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
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// app.listen(Port, () => {
//   console.log(` Server is running on http://localhost:${Port}`);
//   console.log(` Stations API: http://localhost:${Port}/api/stations`);
//   console.log(` Search API: http://localhost:${Port}/api/search-location?q=noida`);
// });
app.listen(Port, () => {
  console.log(` Server is running on http://localhost:${Port}`);
  console.log(` Stations API: http://localhost:${Port}/api/stations`);
  console.log(` Search API: http://localhost:${Port}/api/search-location?q=noida`);
});

async function main() {
  try {
    if (Mongo_URI) {
      await mongoose.connect(Mongo_URI);
      console.log(' Connected to MongoDB');
    } else {
      console.log('MongoDB URI not configured');
    }
  } catch (error) {
    console.log('MongoDB Connection Error:', error.message);
  }
}

main();
