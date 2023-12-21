const { CustomApiError } = require("./CustomApiError");

class BadRequestError extends CustomApiError {
  statusCode = 400;
  constructor(message) {
    super(message);
  }
}

module.exports = { BadRequestError };
