const { CustomApiError } = require("./CustomApiError");

class NotFoundError extends CustomApiError {
  statusCode = 404;
  constructor(message) {
    super(message);
  }
}

module.exports = { NotFoundError };
