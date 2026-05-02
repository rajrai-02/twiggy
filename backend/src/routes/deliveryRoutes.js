const express = require('express');
const router = express.Router();
const { updateLocation, getLocation } = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Only delivery partners can update their location
router.post('/gps', authorize('delivery'), updateLocation);

// Consumers/Providers/Admins can fetch a delivery partner's location
router.get('/gps/:partnerId', getLocation);

module.exports = router;
