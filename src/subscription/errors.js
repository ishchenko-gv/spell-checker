const SubscriptionErrorCodes = {
  SUBSCRIPTION_EXISTS: "SUBSCRIPTION_EXISTS",
};

class SubscriptionError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}

module.exports = {
  SubscriptionErrorCodes,
  SubscriptionError,
};
