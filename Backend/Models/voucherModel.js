const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  voucher_name: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  product_image: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date,
    default: function () {
      return new Date(this.start_time.getTime() + 24 * 60 * 60 * 1000);
    }
  },
  winner_bid_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    default: null
  },
  is_expired: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Voucher", voucherSchema);
