const mongoose = require("mongoose");

const bikeList = new mongoose.Schema(
  {
    brand: { type: String },
    model: { type: String },
  },
  {
    timestamps: true,
  }
);

const BikeList = mongoose.model("bikeList", bikeList);

module.exports = BikeList;
