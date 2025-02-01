//backend/Models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Out for Delivery', 'Cancelled', 'Returned'], 
        default: 'Pending' 
      },
      refundAmountStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: null
      }
    }
  ],
  selectedAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay'], required: true },
  paid: { type: Boolean, default: false },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Out for Delivery', 'Cancelled', 'Returned'],
    default: 'Pending'
  },

  cancellation: {
    type: {
      reason: String,
      cancelledAt: { type: Date, default: Date.now },
      status: { type: String, default: 'cancelled' },
    },
    default: null,
  },
});

module.exports = mongoose.model('Order', OrderSchema);