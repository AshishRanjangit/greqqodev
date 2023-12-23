const adminService = require("../services/admin.service");
const { sendResponse } = require("../utils/sendResponse");
exports.signIn = async (req, res) => {
  const { email, password, otp } = req.body;
  const response = await accountService.signIn({ email, password, otp });

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};

exports.createCategory = async (req, res) => {
  const categoryData = req.body;
  const response = await adminService.createCategory(categoryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.createSubcategory = async (req, res) => {
  const categoryData = req.body;
  const response = await adminService.createSubcategory(categoryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
