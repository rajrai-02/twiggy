const express = require('express');
const router = express.Router();
const { skipOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getOrders);
router.patch('/skip/:date', skipOrder);

module.exports = router;
