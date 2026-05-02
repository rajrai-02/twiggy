const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  service: { type: String, required: true }, // e.g., 'OrderEngine', 'OrderWorker'
  message: { type: String, required: true },
  stack: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed }, // The data being processed when it failed
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ErrorLog', errorLogSchema);
