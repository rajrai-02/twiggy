const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address_text: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  auth: {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    resetToken: { type: String }
  },
  role: {
    type: String,
    enum: ['consumer', 'provider', 'delivery', 'admin'],
    default: 'consumer'
  },
  profile: {
    name: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String }
  },
  address_book: [addressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
