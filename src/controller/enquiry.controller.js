const enquiryService = require("../services//enquiry.service");
const { sendResponse } = require("../utils/sendResponse");

exports.postEnquiry = async (req, res) => {
  const adId = req.body.adId;
  const userId = req.user.userId;
  const response = await enquiryService.postEnquiry(userId, adId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getEnquiriesBuyer = async (req, res) => {
  let { page, limit, keyword, status } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    status,
    keyword,
  };
  let userId = req.user.userId;

  const response = await enquiryService.getEnquiriesBuyer(userId, queryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getEnquiriesSeller = async (req, res) => {
  let { page, limit, keyword, status } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    status,
    keyword,
  };
  let userId = req.user.userId;

  const response = await enquiryService.getEnquiriesSeller(userId, queryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getEnquiriesOnAd = async (req, res) => {
  let { page, limit, keyword, status } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    status,
    keyword,
  };
  let adId = req.query.adId;
  let userId = req.user.userId;

  const response = await enquiryService.getEnquiriesOnAd(
    userId,
    adId,
    queryData
  );
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.updateEnquiryStatus = async (req, res) => {
  let { enquiryId, status } = req.body;
  let userId = req.user.userId;

  const response = await enquiryService.updateEnquiryStatus(
    userId,
    enquiryId,
    status
  );
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.deleteEnquiry = async (req, res) => {
  let enquiryId = req.params.enquiryId;
  let userId = req.user.userId;

  const response = await enquiryService.deleteEnquiry(userId, enquiryId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getEnquiryBuyer = async (req, res) => {
  let enquiryId = req.params.enquiryId;
  let userId = req.user.userId;

  const response = await enquiryService.getEnquiryBuyer(userId, enquiryId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.shareDetailsEnquiry = async (req, res) => {
  let enquiryId = req.params.enquiryId;
  let userId = req.user.userId;

  const response = await enquiryService.shareDetailsEnquiry(userId, enquiryId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
