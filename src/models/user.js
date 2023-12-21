const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String},
    company: { type: String },
    password: String,
    isEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", user);

module.exports = User;
