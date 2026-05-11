const express = require('express');
const router = express.Router();
const { register, login, logout, refresh, forgotPassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.put('/profile', protect, updateProfile);

// OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // req.user has been populated by passport
    const { accessToken, refreshToken } = require('../utils/generateToken').generateTokens(req.user._id, req.user.role);
    require('../utils/generateToken').setTokenCookies(res, accessToken, refreshToken);

    res.redirect('http://localhost:5173/dashboard'); // Redirect to frontend
  }
);

// Protected test route
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
