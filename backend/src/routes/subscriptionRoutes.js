const express = require('express');
const router = express.Router();
const { createSubscription, getSubscriptions, updateSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createSubscription);
router.get('/', getSubscriptions);
router.patch('/:id/status', updateSubscriptionStatus);

module.exports = router;
