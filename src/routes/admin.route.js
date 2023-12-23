const express = require("express");
const adminController = require("../controller/admin.controller");
// const { verifyToken } = require("../middlewares/verifyAuth");
const {
  signInValidator,
  signupValidation,
  emailValidation,
} = require("../validations/account.validation");
const {
  expressValidation,
} = require("../middlewares/expressValidationMiddleware");
const adminRoute = express.Router();
adminRoute.route("/createCategory").post(adminController.createCategory);
adminRoute.route("/createSubcategory").post(adminController.createSubcategory);
module.exports = adminRoute;
