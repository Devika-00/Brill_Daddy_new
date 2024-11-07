// cart model
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
      },
      quantity: { 
        type: Number,
        default: 1 
      },
      price: { // Store the applied price per item here
        type: Number,
        required: true
      }
    }
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
