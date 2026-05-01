const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  items: [{ type: String }],
  ai_generated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
