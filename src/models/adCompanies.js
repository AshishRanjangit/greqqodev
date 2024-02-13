const mongoose = require("mongoose");

const company = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", company);

module.exports = Company;
