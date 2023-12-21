class CustomApiError extends Error {
  statusCode;

  constructor(message) {
    super(message);
  }
}

module.exports = { CustomApiError };
