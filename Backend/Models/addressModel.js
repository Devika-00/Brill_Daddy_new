// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },
  addressLine: { type: String, required: true },
  pincode: { type: String, required: true },
  street: { type: String, required: true },
  state: { type: String, required: true },
  flatNumber: { type: String, required: true },
  phoneNumber:{type:Number, required:true},
  addressType: { type: String, enum: ['Home', 'Work', 'Others'], required: true }
});

module.exports = mongoose.model('Address', addressSchema);
