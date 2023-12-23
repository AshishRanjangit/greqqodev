const adService = require("../services/ad.service");
const { sendResponse } = require("../utils/sendResponse");
exports.signIn = async (req, res) => {
  const { email, password, otp } = req.body;

  const response = await accountService.signIn({ email, password, otp });

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};

exports.getCategory = async (req, res) => {
  const response = await adService.getCategory();
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getSubcategory = async (req, res) => {
  const categoryData = req.query;
  const response = await adService.getSubcategory(categoryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
