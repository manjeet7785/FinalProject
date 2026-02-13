// const jwt = require('jsonwebtoken');
// const User = require('../Model/User');

// const JWT_SECRET = process.env.JWT_SECRET;

// const auth = async (req, res, next) => {
//   try {
//     // Get token from header
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Find user by ID
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     // Add user to request
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = auth;





const jwt = require('jsonwebtoken');
const User = require('../Model/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Token verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User dhoondna (Payload mein 'id' bhej rahe hain hum)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user; // Ab req.user._id available hoga controller mein
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = auth;