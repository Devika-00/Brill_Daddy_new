//backend/Models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    latitude: { type: Number, },
    longitude: { type: Number, },
  },
  registerAddress: String,
  currentAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);