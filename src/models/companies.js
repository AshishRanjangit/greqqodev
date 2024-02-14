const mongoose = require("mongoose");

const companyList = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

const CompanyList = mongoose.model("CompanyList", companyList);

module.exports = CompanyList;
