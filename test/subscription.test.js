const { checkFreeAttempts } = require("../src/subscription");
const dal = require("../src/subscription/dal");

describe("subscription", () => {
  it("should check free attempts in database", async () => {
    const userId = getRandomUserId();

    expect(await checkFreeAttempts(userId)).toBe(2);
    expect(await checkFreeAttempts(userId)).toBe(1);
    expect(await checkFreeAttempts(userId)).toBe(0);
    expect(await checkFreeAttempts(userId)).toBe(0);
  });

  it("should create attempts for user", async () => {
    expect(await dal.createAttemptsForUser(getRandomUserId())).toBe(2);
  });
});

/**
 * @returns {number}
 */
function getRandomUserId() {
  return Number.parseInt(Math.random() * 1000000);
}
