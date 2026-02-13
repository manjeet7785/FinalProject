const mongoose = require('mongoose');
const Station = require('./Model/Station');
const stations = require('./API/Station');

const Mongo_URI = 'mongodb+srv://manjeetmaurya7785_db_user:f9Q4YLCbY2Y26jSX@alldata.a9zrfm3.mongodb.net/EvChargingStation';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(Mongo_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (Optional: Uncomment if you want a fresh start)
    // await Station.deleteMany({}); 

    const formattedStations = stations
      .filter(station => station.name && station.location && (station.lat || station.latitude))
      .map(station => {

        // --- ROBUST TYPE NORMALIZATION ---
        let rawType = (station.type || 'AC').toUpperCase();
        let finalType = 'AC'; // Default

        if (rawType.includes('DC') && rawType.includes('AC')) {
          finalType = 'AC/DC';
        } else if (rawType.includes('DC')) {
          finalType = 'DC';
        } else if (rawType.includes('AC')) {
          finalType = 'AC';
        }

        return {
          name: station.name,
          district: station.district || 'Not Specified',
          state: station.state || 'Uttar Pradesh',
          location: station.location,
          latitude: station.latitude || station.lat,
          longitude: station.longitude || station.lng,
          type: finalType, // Validated against enum
          capacity: station.capacity || 'Not specified',
          timing: station.timing || '24/7',
          contact: station.contact || 'Not Available',
          email: station.email || '',
          rating: station.rating || 4.0,
          source: station.source || 'Static Data'
        };
      });

    // Insert stations into database
    const result = await Station.insertMany(formattedStations);
    console.log(`✅ Successfully saved ${result.length} stations to database`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();