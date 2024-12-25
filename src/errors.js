const ErrorCodes = {
  SUBSCRIPTION_EXISTS: "SUBSCRIPTION_EXISTS",
};

class AppError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}

module.exports = {
  AppError,
  ErrorCodes,
};
