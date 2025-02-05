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
  profileImage: {
    type: String, // URL of the profile image
    default: "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png", // Default placeholder image
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);