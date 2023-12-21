const isSuccess = (statusCode) => {
  const errorStatusCodes = [400, 401, 429, 404, 403, 500, 469];
  return errorStatusCodes.every((status) => status !== statusCode);
};

exports.sendResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    success: isSuccess(statusCode) ? true : false,
    data,
    message: message,
  });
};
