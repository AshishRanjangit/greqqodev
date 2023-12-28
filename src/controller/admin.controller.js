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

exports.getAllAdds = async (req, res) => {
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
    user,
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
    user,
  };
  let userId = req.user.userId;

  const response = await adminService.getAllAdds(queryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.updateStatusAd = async (req, res) => {
  let id = req.params.adId;
  let status = req.body.status;
  const response = await adminService.updateStatusAd(id, status);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getAd = async (req, res) => {
  let id = req.params.adId;

  const response = await adminService.getAd(id);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

exports.getUsers = async (req, res) => {
  let { page, limit, keyword } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 10;
  let queryData = {
    page,
    limit,
    keyword,
  };
  const response = await adminService.getUsers(queryData);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};
