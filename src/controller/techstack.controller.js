const techstackService = require("../services/techstack.service");
const { sendResponse } = require("../utils/sendResponse");

exports.getTechstack = async (req, res) => {
  const response = await techstackService.getTeckStack();

  const { statusCode, data, message } = response;

  return sendResponse(res, statusCode, data, message);
};
