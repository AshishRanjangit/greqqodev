const accountService = require("../services/account.service");
const { sendResponse } = require("../utils/sendResponse");
exports.signIn = async (req, res) => {
  const { email, password, otp } = req.body;
  const response = await accountService.signIn({ email, password, otp });

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const response = await accountService.verifyEmail({ email, otp });

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};

exports.signUp = async (req, res) => {
  const userData = req.body;

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

exports.getUser = async (req, res) => {
  const userId = req.user.userId;
  const response = await accountService.getUser(userId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.updateUser = async (req, res) => {
  const userId = req.user.userId;
  const userData = req.body;
  const response = await accountService.updateUser(userId, userData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.forgetPassword = async (req, res) => {
  const email = req.body.email;
  const response = await accountService.forgetPassword(email);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const response = await accountService.resetPassword(token, newPassword);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
