const mongoose = require("mongoose");

const enquiry = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad" },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquiry);

module.exports = Enquiry;
