const Subscription = require('../models/Subscription');

// Create a new subscription
// POST /api/v1/subscriptions
const createSubscription = async (req, res) => {
  const { provider_id, plan } = req.body;
  try {
    const subscription = await Subscription.create({
      user_id: req.user.userId,
      provider_id,
      plan,
      status: 'active',
      payment: {
        last_billed: new Date(),
        next_billing: new Date(new Date().getTime() + (plan === 'Weekly' ? 7 : 30) * 24 * 60 * 60 * 1000)
      }
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get user's subscriptions
//GET /api/v1/subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user_id: req.user.userId }).populate('provider_id', 'profile.name');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update subscription status (e.g., pause/resume)
//PATCH /api/v1/subscriptions/:id
const updateSubscriptionStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.userId },
      { status },
      { new: true }
    );
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription, getSubscriptions, updateSubscriptionStatus };
