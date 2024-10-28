// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  selectedAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay'], required: true },
  paid: { type: Boolean, default: false },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Order', OrderSchema);
