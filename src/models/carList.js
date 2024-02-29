const mongoose = require("mongoose");

const carList = new mongoose.Schema(
  {
    brand: { type: String },
    model: { type: String },
  },
  {
    timestamps: true,
  }
);

const CarList = mongoose.model("carList", carList);

module.exports = CarList;
