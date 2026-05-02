const Order = require('../models/Order');

// @desc    Skip an upcoming order
// @route   PATCH /api/v1/orders/skip/:date
const skipOrder = async (req, res) => {
  const { date } = req.params;
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  try {
    // Check if an order already exists for this date to mark it skipped
    let order = await Order.findOne({ user_id: req.user.userId, date: targetDate });

    if (order) {
      order.status = 'skipped';
      await order.save();
    } else {
      // If it doesn't exist yet, we create a skipped placeholder so the cron job knows to ignore it
      order = await Order.create({
        user_id: req.user.userId,
        provider_id: req.body.provider_id, // Required in body if order not generated yet
        date: targetDate,
        status: 'skipped'
      });
    }

    res.json({ message: 'Order skipped for ' + targetDate.toDateString(), order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/v1/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.userId }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { skipOrder, getOrders };
