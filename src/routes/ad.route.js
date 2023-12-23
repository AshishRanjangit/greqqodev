const express = require("express");
const adController = require("../controller/ad.controller");
// const { verifyToken } = require("../middlewares/verifyAuth");
const {
  signInValidator,
  signupValidation,
  emailValidation,
} = require("../validations/account.validation");
const {
  expressValidation,
} = require("../middlewares/expressValidationMiddleware");
const adRoute = express.Router();
adRoute.route("/getCategory").get(adController.getCategory);
adRoute.route("/getSubcategory").get(adController.getSubcategory);
module.exports = adRoute;
