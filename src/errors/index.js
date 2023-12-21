const { AccessForbiddenError } = require("./apiErrors/AcessForbiddenError");
const { BadRequestError } = require("./apiErrors/BadRequestError");
const { NotAuthorizedError } = require("./apiErrors/NotAuthorizeError");
const { NotFoundError } = require("./apiErrors/NotFoundError");

module.exports = {
  BadRequestError,
  AccessForbiddenError,
  NotAuthorizedError,
  NotFoundError,
};
