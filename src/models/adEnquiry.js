const mongoose = require("mongoose");

const enquiry = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //WHO HAVE POSTED THE AD
    ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad" },
    enquiryUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //WHO HAVE ENQUIRED FOR THE ADD
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquiry);

module.exports = Enquiry;
