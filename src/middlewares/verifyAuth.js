const accessTokenKey = process.env.JWT_TOKEN_KEY;

const jwt = require("jsonwebtoken");
const { NotAuthorizedError, AccessForbiddenError } = require("../errors");

exports.verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    const token = tokenHeader.split(" ")[1];

    jwt.verify(token, accessTokenKey, (err, user) => {
      if (err) {
        throw new NotAuthorizedError("Expired or wrong token");
      }
      req.user = user;
      return next();
    });
  } else {
    throw new NotAuthorizedError("Oops the access-token is missing!");
  }
};
