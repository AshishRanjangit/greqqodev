const adService = require("../services/ad.service");
const { sendResponse } = require("../utils/sendResponse");

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

exports.changeAdStatus = async (req, res) => {
  const id = req.params.id;
  const response = await adService.changeAdStatus(id);
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
    company,
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
    company,
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
  let userId = req.user.userId;
  let id = req.params.adId;

  const response = await adService.getAd(id, isloggedIn, userId);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getBikeBrands = async (req, res) => {
  const response = await adService.getBikeBrands();
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getBikeModels = async (req, res) => {
  const brand = req.body.brand;
  const response = await adService.getBikeModels(brand);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getCarBrands = async (req, res) => {
  const response = await adService.getCarBrands();
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getCarModels = async (req, res) => {
  const brand = req.body.brand;
  const response = await adService.getCarModels(brand);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getCarVariant = async (req, res) => {
  const variant = req.body.model;
  const response = await adService.getCarVariant(variant);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getCompanies = async (req, res) => {
  const response = await adService.getCompanies();
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
