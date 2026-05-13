const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateTokens, setTokenCookies } = require('../utils/generateToken');
const { redisClient } = require('../config/redis');
const { getChannel } = require('../config/rabbitmq');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ 'auth.email': email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      auth: { email, password: hashedPassword },
      profile: { name },
      role: role || 'user'
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.profile.name,
      email: user.auth.email,
      role: user.role,
      accessToken,
      isProfileComplete: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 'auth.email': email });
    if (!user || !user.auth.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.auth.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    setTokenCookies(res, accessToken, refreshToken);

    const isProfileComplete = !!(user.profile.phone && user.address_book && user.address_book.length > 0);

    res.json({
      _id: user._id,
      name: user.profile.name,
      email: user.auth.email,
      role: user.role,
      accessToken,
      isProfileComplete
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie / blacklist token
// @route   POST /api/v1/auth/logout
const logout = async (req, res) => {
  try {
    const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token) {
      // Decode token to get expiration to set TTL in Redis
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
          // Add to blacklist
          await redisClient.setEx(`bl_${token}`, expiresIn, 'revoked');
        }
      }
    }

    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Forgot Password
// POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ 'auth.email': email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hashed token in Redis with 15 min TTL
    await redisClient.setEx(`pwd_reset_${email}`, 15 * 60, hashedToken);

    // Publish email task to RabbitMQ
    const channel = getChannel();
    const payload = {
      email,
      resetToken, // Send plain token to user
      name: user.profile.name
    };

    channel.sendToQueue('email_queue', Buffer.from(JSON.stringify({
      type: 'FORGOT_PASSWORD',
      payload
    })));

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
// PUT /api/v1/auth/profile
const updateProfile = async (req, res) => {
  const { 
    name, phone, businessName, description, vehicleType, licensePlate, dietaryPreferences,
    address_text, lat, lng,
    currentPassword, newPassword
  } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle Password Change
    if (currentPassword && newPassword) {
      if (!user.auth.password) {
        return res.status(400).json({ message: 'Google OAuth users cannot change password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.auth.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password.' });
      }
      const salt = await bcrypt.genSalt(12);
      user.auth.password = await bcrypt.hash(newPassword, salt);
    }

    // General fields
    if (name) user.profile.name = name;
    if (phone) user.profile.phone = phone;
    
    // Role specific fields
    if (user.role === 'provider') {
      if (businessName !== undefined) user.profile.businessName = businessName;
      if (description !== undefined) user.profile.description = description;
    }
    if (user.role === 'delivery') {
      if (vehicleType !== undefined) user.profile.vehicleType = vehicleType;
      if (licensePlate !== undefined) user.profile.licensePlate = licensePlate;
    }
    if (user.role === 'consumer') {
      if (dietaryPreferences !== undefined) user.profile.dietaryPreferences = dietaryPreferences;
    }

    if (address_text && lat && lng) {
      // Overwrite the address book with the primary location for simplicity in MVP
      user.address_book = [{
        label: 'Home',
        address_text,
        coords: { lat, lng }
      }];
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      isProfileComplete: !!(user.profile.phone && user.address_book && user.address_book.length > 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
// GET /api/v1/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-auth.password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout, refresh, forgotPassword, updateProfile, getMe };
