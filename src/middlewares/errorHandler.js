const errorHandler = (err, req, res, next) => {
  console.log("Error from common mware ==>", err);
  if (err.code === 11000) {
    err.message = `${Object.keys(err.keyPattern)[0]} already exists`;
    err.statusCode = 400;
  }

  return res
    .status(err.statusCode || 500)
    .json({ success: false, data: {}, message: err.message });
};

module.exports = { errorHandler };
