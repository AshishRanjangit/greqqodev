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
const { verifyToken, verifyRole } = require("../middlewares/verifyAuth");
const adminRoute = express.Router();
adminRoute.route("/createCategory").post(
  // verifyToken, verifyRole("admin"),
  adminController.createCategory
);
adminRoute.route("/createSubcategory").post(
  // verifyToken, verifyRole("admin"),
  adminController.createSubcategory
);
adminRoute
  .route("/getAdds")
  .get(verifyToken, verifyRole("admin"), adminController.getAllAdds);
adminRoute
  .route("/updateAdStatus/:adId")
  .put(verifyToken, verifyRole("admin"), adminController.updateStatusAd);
adminRoute
  .route("/getAd/:adId")
  .get(verifyToken, verifyRole("admin"), adminController.getAd);
adminRoute
  .route("/getUsers")
  .get(verifyToken, verifyRole("admin"), adminController.getUsers);

module.exports = adminRoute;
