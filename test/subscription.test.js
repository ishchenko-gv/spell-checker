const dal = require("../src/subscription/dal");
const {
  checkFreeAttempts,
  subscribeUser,
  checkUserSubscription,
} = require("../src/subscription");
const { getRandomUserId } = require("./utils");

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

    await subscribeUser(userId, "month_plan");

    const isUserSubscribed = await checkUserSubscription(userId);

    expect(isUserSubscribed).toBe(true);
  });
});
