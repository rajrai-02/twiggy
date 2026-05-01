const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['Weekly', 'Monthly'], required: true },
  status: { type: String, enum: ['active', 'paused', 'expired'], default: 'active' },
  payment: {
    gateway_sub_id: { type: String },
    last_billed: { type: Date },
    next_billing: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
