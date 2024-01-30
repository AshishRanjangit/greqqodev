const express = require("express");
const enquiryController = require("../controller/enquiry.controller");
const { verifyToken } = require("../middlewares/verifyAuth");
const enquiryRoute = express.Router();

enquiryRoute
  .route("/postEnquiry")
  .post(verifyToken, enquiryController.postEnquiry);
enquiryRoute
  .route("/getEnquiriesBuyer")
  .get(verifyToken, enquiryController.getEnquiriesBuyer);
enquiryRoute
  .route("/getEnquiriesSeller")
  .get(verifyToken, enquiryController.getEnquiriesSeller);
enquiryRoute
  .route("/getEnquiriesOnAd")
  .get(verifyToken, enquiryController.getEnquiriesOnAd);
enquiryRoute
  .route("/updateEnquiryStatus")
  .patch(verifyToken, enquiryController.updateEnquiryStatus);
enquiryRoute
  .route("/deleteEnquiry/:enquiryId")
  .delete(verifyToken, enquiryController.deleteEnquiry);
module.exports = enquiryRoute;
