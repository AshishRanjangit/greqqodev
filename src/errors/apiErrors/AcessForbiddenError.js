const { CustomApiError } = require("./CustomApiError");

class AccessForbiddenError extends CustomApiError {
  statusCode = 403;
  constructor(message) {
    super(message);
  }
}
module.exports = { AccessForbiddenError };
