const { CustomApiError } = require("./CustomApiError");

class NotAuthorizedError extends CustomApiError {
  statusCode = 401;
  constructor(message) {
    super(message);
  }
}

module.exports = { NotAuthorizedError };
