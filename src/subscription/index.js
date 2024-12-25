const dal = require("./dal");

module.exports = {
  checkFreeAttempts,
  validatePlanSlug,
  subscribeUser,
  checkUserSubscription,
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

/**
 * @param {string} slug
 * @returns {Promise<boolean>}
 */
async function validatePlanSlug(slug) {
  const plan = await dal.getPlanBySlug(slug);
  return !!plan;
}

/**
 * @param {number} userId
 * @param {string} planSlug
 */
async function subscribeUser(userId, planSlug) {
  const plan = await dal.getPlanBySlug(planSlug);

  await dal.createUserSubscription(userId, plan.id, plan.duration_months);
}

/**
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
async function checkUserSubscription(userId) {
  const subscription = await dal.getSubscriptionByUser(userId);
  console.log("checkUserSubscription", subscription);
}
