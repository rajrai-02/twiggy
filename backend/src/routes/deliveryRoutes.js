const express = require('express');
const router = express.Router();
const { updateLocation, getLocation, getDashboardStats, getTodayRuns } = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', authorize('delivery', 'admin'), getDashboardStats);
router.get('/runs/today', authorize('delivery', 'admin'), getTodayRuns);

// Only delivery partners can update their location
router.post('/gps', authorize('delivery'), updateLocation);

// Consumers/Providers/Admins can fetch a delivery partner's location
router.get('/gps/:partnerId', getLocation);

module.exports = router;
