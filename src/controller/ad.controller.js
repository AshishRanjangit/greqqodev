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

exports.postAd = async (req, res) => {
  const adData = req.body;
  const userId = req.user.userId;
  const response = await adService.postAd(userId, adData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.updateAd = async (req, res) => {
  const adData = req.body;
  const id = req.params.id;
  const response = await adService.updateAd(id, adData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.deleteAd = async (req, res) => {
  const id = req.params.id;
  const response = await adService.deleteAd(id);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.sendOtpAd = async (req, res) => {
  const email = req.body.email;
  const response = await adService.sendOtpAd(email);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.verifyEmailAd = async (req, res) => {
  const otpData = req.body;
  const response = await adService.verifyEmailAd(otpData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getAllAdsUser = async (req, res) => {
  let {
    page,
    limit,
    status,
    city,
    state,
    category,
    subcategory,
    fuel,
    transmission,
    brand,
    smallPrice,
    bigPrice,
    locality,
    keyword,
    occupancy,
    construnction,
    listedBy,
  } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    status,
    city,
    state,
    category,
    subcategory,
    fuel,
    transmission,
    brand,
    smallPrice,
    bigPrice,
    locality,
    keyword,
    occupancy,
    construnction,
    listedBy,
  };
  let userId = req.user.userId;

  console.log("This is userId", userId);

  const response = await adService.getAllAdsUser(queryData, userId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getAllAds = async (req, res) => {
  let {
    page,
    limit,
    status,
    city,
    state,
    category,
    subcategory,
    fuel,
    transmission,
    brand,
    smallPrice,
    bigPrice,
    locality,
    keyword,
    occupancy,
    construnction,
    listedBy,
  } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    status,
    city,
    state,
    category,
    subcategory,
    fuel,
    transmission,
    brand,
    smallPrice,
    bigPrice,
    locality,
    keyword,
    occupancy,
    construnction,
    listedBy,
  };
  let isloggedIn = req.isloggedIn;

  const response = await adService.getAllAds(queryData, isloggedIn);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getAd = async (req, res) => {
  let isloggedIn = req.isloggedIn;
  let id = req.params.adId;

  const response = await adService.getAd(id, isloggedIn);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
