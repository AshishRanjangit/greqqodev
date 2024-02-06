const express = require("express");
const accountController = require("../controller/account.controller");
// const { verifyToken } = require("../middlewares/verifyAuth");
const {
  signInValidator,
  signupValidation,
  emailValidation,
  emailOtpValidator,
  updateUserValidation,
  resetPasswordValidation,
  forgetPasswordValidation,
} = require("../validations/account.validation");
const {
  expressValidation,
} = require("../middlewares/expressValidationMiddleware");
const { verifyToken } = require("../middlewares/verifyAuth");
const accountRoute = express.Router();

accountRoute
  .route("/signin")
  .post(signInValidator, expressValidation, accountController.signIn);
accountRoute
  .route("/signup")
  .post(signupValidation, expressValidation, accountController.signUp);
accountRoute
  .route("/sendEmailVerificationOtp")
  .post(
    emailValidation,
    expressValidation,
    accountController.sendEmailVerificationOtp
  );
accountRoute
  .route("/sendOtp")
  .post(emailValidation, expressValidation, accountController.sendOtp);
accountRoute
  .route("/verifyEmail")
  .post(emailOtpValidator, expressValidation, accountController.verifyEmail);
accountRoute.route("/getUser").get(verifyToken, accountController.getUser);

accountRoute.route("/updateUser").patch(
  verifyToken,
  updateUserValidation,
  expressValidation,

  accountController.updateUser
);
accountRoute
  .route("/forgetPassword")
  .post(
    forgetPasswordValidation,
    expressValidation,
    accountController.forgetPassword
  );
accountRoute
  .route("/resetPassword")
  .post(
    resetPasswordValidation,
    expressValidation,
    accountController.resetPassword
  );

module.exports = accountRoute;
