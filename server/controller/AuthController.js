const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id || user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id || user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

const SignUp = async (req, res) => {
  try {
    const body = req.body || {};
    const { FirstName, LastName, MobileNumber, email, password, confirmPassword, vehicleNumber } = body;

    // console.log(req.body);

    if (!FirstName || !LastName || !MobileNumber || !email || !password || !confirmPassword || !vehicleNumber) {
      return res.status(400).send({ message: 'All fields are required' });
    }


    const OldUser = await User.findOne({ email });
    if (OldUser) {
      return res.status(400).send({ message: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      FirstName,
      LastName,
      MobileNumber,
      email,
      password: hashedPassword,
      vehicleNumber,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).send({
      message: 'User registered successfully',
      accessToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName
      }
    });
  } catch (error) {
    // Provide better error feedback for validation failures
    const status = error?.name === 'ValidationError' ? 400 : 500;
    res.status(status).send({
      error: error.message,
      message: status === 400 ? 'Validation error' : 'Server error'
    });
  }
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd, // true only on HTTPS
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Send access token and complete user info
    return res.status(200).send({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        MobileNumber: user.MobileNumber,
        vehicleNumber: user.vehicleNumber
      }
    });
  } catch (error) {
    console.error('SignIn error:', error);
    return res.status(500).send({ message: 'Server error' });
  }
};
const SignOut = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.status(200).send({ message: 'Signed out successfully' });
}

const RefreshAccessToken = async (req, res) => {
  const Cookies = req.cookies;
  if (!Cookies?.refreshToken) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const refreshToken = Cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const payload = { id: decoded.id, email: decoded.email };
    const accessToken = generateAccessToken(payload);
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(403).send({ message: 'Forbidden' });
  }
}

module.exports = { SignUp, SignIn, SignOut, RefreshAccessToken };