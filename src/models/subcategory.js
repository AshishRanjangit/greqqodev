const mongoose = require("mongoose");

const subcategory = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const Subcategory = mongoose.model("Subcategory", subcategory);
module.exports = Subcategory;
