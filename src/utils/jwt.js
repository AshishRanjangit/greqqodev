const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenKey = process.env.JWT_TOKEN_KEY;

exports.generateToken = async (user) => {
  const { _id, role, isActive } = user;
  return new Promise((res, rej) => {
    jwt.sign(
      {
        userId: _id,
        isActive,
        role,
      },
      accessTokenKey,
      {
        expiresIn: process.env.NODE_ENV === "dev" ? "2d" : "2d",
      },

      (err, token) => {
        if (err) return rej("Unable to generate access token");
        return res(token);
      }
    );
  });
};
