const mongoose = require('mongoose');
const Mongo_URI = 'mongodb+srv://manjeetmaurya7785_db_user:f9Q4YLCbY2Y26jSX@alldata.a9zrfm3.mongodb.net/EvChargingStation'
const Port = 4000;
const Express = require('express');
const app = Express();


const connectDB = async () => {
  try {
    if (Mongo_URI) {
      await mongoose.connect(Mongo_URI);
      console.log('Connected to MongoDB');
    } else {
      console.error('MongoDB URI not provided. Please set the Mongo_URI variable.');
    }
  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
app.listen(Port, () => {
  console.log("Sever Connected");
});


module.exports = connectDB;
