const dal = require("./dal");

module.exports = {
  checkFreeAttempts,
};

/**
 * @param {number} userId
 * @returns {Promise<number>} amount of free attempts remained
 */
async function checkFreeAttempts(userId) {
  const attempts = await dal.getAttemptsByUserId(userId);

  if (attempts === -1 || (await dal.getDaysSinceLastAttempt(userId)) > 0) {
    return dal.createAttemptsForUser(userId);
  }

  if (!attempts) {
    return 0;
  }

  return dal.decrementFreeAttempts(userId);
}
