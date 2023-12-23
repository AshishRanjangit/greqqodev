const mongoose = require("mongoose");

const category = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", category);

module.exports = Category;
