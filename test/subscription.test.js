const {
  checkFreeAttempts,
  // createAttemptsForUser,
  getDaysSinceLastAttempt,
} = require("../subscription/index.js");

describe("subscription", () => {
  it("should check free attempts in database", async () => {
    await checkFreeAttempts(1234);
  });

  it("should create attempts for user", async () => {
    // const result = await createAttemptsForUser(123);
    // console.log("subscriptions.test.attempts", result);
  });

  it("should calculate days since last attempt", async () => {
    const result = await getDaysSinceLastAttempt(123);
    console.log("subscription.test", result);
  });
});
