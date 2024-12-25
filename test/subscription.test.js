const { checkFreeAttempts } = require("../src/subscription");
const dal = require("../src/subscription/dal");

describe("subscription", () => {
  it("should check free attempts in database", async () => {
    const userId = 999;

    expect(await checkFreeAttempts(userId)).toBe(2);
    expect(await checkFreeAttempts(userId)).toBe(1);
    expect(await checkFreeAttempts(userId)).toBe(0);
    expect(await checkFreeAttempts(userId)).toBe(0);

    // console.log("free attempts:", await checkFreeAttempts(userId));
    // console.log("================================================");
    // console.log("free attempts:", await checkFreeAttempts(userId));
    // console.log("================================================");
    // console.log("free attempts:", await checkFreeAttempts(userId));
    // console.log("================================================");
    // console.log("free attempts:", await checkFreeAttempts(userId));
  });

  it("should create attempts for user", async () => {
    expect(await dal.createAttemptsForUser(888)).toBe(2);
  });

  it("should calculate days since last attempt", async () => {
    // const result = await dal.getDaysSinceLastAttempt(123);
    // console.log("subscription.test", result);
  });
});
