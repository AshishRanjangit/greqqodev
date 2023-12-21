const accountService = require("../services/account.service");
const { sendResponse } = require("../utils/sendResponse");
exports.signIn = async (req, res) => {
  const { email, password, otp } = req.body;
  const response = await accountService.signIn({ email, password, otp });

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};
exports.signUp = async (req, res) => {
  const userData = req.body;

  console.log(userData);

  const response = await accountService.signUp(userData);

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const response = await accountService.sendOtp(email);

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};
