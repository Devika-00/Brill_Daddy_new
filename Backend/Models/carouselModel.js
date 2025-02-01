const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("CarouselImage", carouselSchema);