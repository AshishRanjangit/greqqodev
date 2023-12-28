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
exports.verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        success: false,
        type: "error",
        message: "user is not allowed to access this resource",
      });
    }
    next();
  };
};
exports.isLoggedIn = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    const token = tokenHeader.split(" ")[1];

    jwt.verify(token, accessTokenKey, (err, user) => {
      if (err) {
        req.isloggedIn = false;
        return next();
      }
      req.user = user;
      req.isloggedIn = true;
      return next();
    });
  } else {
    req.isloggedIn = false;
    return next();
  }
};
