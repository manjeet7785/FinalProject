// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   FirstName: {
//     type: String,
//     required: true,

//   },

//   LastName: {
//     type: String,
//     required: true,

//   },

//   MobileNumber: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return /^\d{10}$/.test(v); // exactly 10 digits hone chahiye
//       },
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,

//     },

//     password: {
//       type: String,
//       required: true,
//       min: 6,
//       max: 64,
//     },

//     confirmPassword: {
//       type: String,
//       required: true,
//       min: 6,
//       max: 64,
//     },

//     vehicleNumber: {
//       type: String,
//       required: true,

//     },
//      { 
//       timestamps: true 
//     },
//   });

// module.exports = mongoose.model('User', UserSchema);    


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
    trim: true
  },
  LastName: {
    type: String,
    required: true,
    trim: true
  },
  MobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Exactly 10 digits only
      },
      message: 'Mobile number must be exactly 10 digits!'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email!']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64
  },
  vehicleNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true  // ✅ Yahan pe sahi jagah!
});

module.exports = mongoose.model('User', UserSchema);
