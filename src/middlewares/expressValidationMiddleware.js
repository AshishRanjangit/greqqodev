const { validationResult } = require("express-validator");
const { sendResponse } = require("../utils/sendResponse");

exports.expressValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      400,
      { errors: errors.array() },
      "Validation Error"
    );
  }
  next();
};
