const express = require("express");
const accountController = require("../controller/account.controller");
// const { verifyToken } = require("../middlewares/verifyAuth");
const {
  signInValidator,
  signupValidation,
  emailValidation,
} = require("../validations/account.validation");
const {
  expressValidation,
} = require("../middlewares/expressValidationMiddleware");
const accountRoute = express.Router();

accountRoute
  .route("/signin")
  .post(signInValidator, expressValidation, accountController.signIn);
accountRoute
  .route("/signup")
  .post(signupValidation, expressValidation, accountController.signUp);
accountRoute
  .route("/sendOtp")
  .post(emailValidation, expressValidation, accountController.sendOtp);

module.exports = accountRoute;
