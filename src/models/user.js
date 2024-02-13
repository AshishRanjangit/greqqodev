const mongoose = require("mongoose");
const { generateHash } = require("../utils/generateHash");

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
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  {
    timestamps: true,
  }
);

user.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }
  try {
    // Generate a salt and hash the password using bcrypt
    this.password = await generateHash(this.password);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", user);

module.exports = User;
