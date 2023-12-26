const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    company: { type: String },
    tags: [{ type: String }],
    password: String,
    profilePicture: String,
    isEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    pincode: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", user);

module.exports = User;
