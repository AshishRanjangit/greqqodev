const express = require("express");
const adController = require("../controller/ad.controller");
const { verifyToken, isLoggedIn } = require("../middlewares/verifyAuth");
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
adRoute.route("/postAd").post(verifyToken, adController.postAd);
adRoute.route("/updateAd/:id").patch(verifyToken, adController.updateAd);
adRoute
  .route("/updateStatus/:id")
  .patch(verifyToken, adController.changeAdStatus);
adRoute.route("/resendOtp").post(verifyToken, adController.sendOtpAd);
adRoute.route("/verifyOtp").post(verifyToken, adController.verifyEmailAd);
adRoute.route("/adsUser").get(verifyToken, adController.getAllAdsUser);
adRoute.route("/getAds").get(isLoggedIn, adController.getAllAds);
adRoute.route("/getCompanies").get(adController.getCompanies);
adRoute.route("/getBikeBrands").get(adController.getBikeBrands);
adRoute.route("/getBikeModel").post(adController.getBikeModels);
adRoute.route("/getAd/:adId").get(isLoggedIn, adController.getAd);
module.exports = adRoute;
