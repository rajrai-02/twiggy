const express = require('express');
const router = express.Router();
const { upsertMenu, getMenu, getAiSuggestion, getDashboardStats, getTodayDeliveries } = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('provider', 'admin')); // Only providers and admins

router.get('/dashboard', getDashboardStats);
router.get('/deliveries/today', getTodayDeliveries);
router.put('/menu/:date', upsertMenu);
router.get('/menu/:date', getMenu);
router.post('/ai-suggest', getAiSuggestion);

module.exports = router;
