const mongoose= require("mongoose");

const otp = new mongoose.Schema(
  {
    email: {
        type:String,
        unique:true,
    },
    otp: String
  },
  {
    timestamps: true,
  }
);

otp.index(
  {
    updatedAt: 1,
  },
  { expireAfterSeconds: 6000 }
);
const Otp = mongoose.model("Otp", otp);

module.exports = Otp;
