const dal = require("../src/subscription/dal");
const {
  checkFreeAttempts,
  subscribeUser,
  checkUserSubscription,
} = require("../src/subscription");

describe("subscription", () => {
  it("should create attempts for user", async () => {
    expect(await dal.createAttemptsForUser(getRandomUserId())).toBe(3);
  });

  it("should check free attempts in database", async () => {
    const userId = getRandomUserId();

    expect(await checkFreeAttempts(userId)).toBe(3);
    expect(await checkFreeAttempts(userId)).toBe(2);
    expect(await checkFreeAttempts(userId)).toBe(1);
    expect(await checkFreeAttempts(userId)).toBe(0);
    expect(await checkFreeAttempts(userId)).toBe(0);
  });

  it("should subscribe user", async () => {
    const userId = getRandomUserId();
    const subscription = await subscribeUser(userId, "month_plan");

    console.info("test/subscription.subscription", subscription);
    await checkUserSubscription(userId);
  });
});

/**
 * @returns {number}
 */
function getRandomUserId() {
  return Number.parseInt(Math.random() * 1000000);
}
