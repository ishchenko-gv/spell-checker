const { db } = require("../db");

const MAX_FREE_ATTEMPTS = 3;

module.exports = {
  getAttemptsByUserId,
  createAttemptsForUser,
  getDaysSinceLastAttempt,
  decrementFreeAttempts,
  getPlanBySlug,
  createUserSubscription,
  getSubscriptionByUser,
};

/**
 * @typedef {import('knex').Knex.QueryBuilder} QueryBuilder
 */

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
async function getAttemptsByUserId(userId) {
  const result = await db()
    .select("*")
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();

  if (!result) {
    return -1;
  }

  return result.attempts_remained;
}

/**
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function createAttemptsForUser(userId) {
  await db()
    .insert({
      tg_user_id: userId,
      attempts_remained: MAX_FREE_ATTEMPTS,
      last_attempt_ts: db().fn.now(),
      updated_at: db().fn.now(),
    })
    .into("free_attempts");

  return MAX_FREE_ATTEMPTS;
}

/**
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function getDaysSinceLastAttempt(userId) {
  const result = await db()
    .select(
      db().raw(
        "extract(day from date_trunc('day', now()) - date_trunc('day', last_attempt_ts))"
      )
    )
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();

  if (!result) {
    return 0;
  }

  return Number(result.extract);
}

/**
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function decrementFreeAttempts(userId) {
  const result = await db()
    .from("free_attempts")
    .where("tg_user_id", userId)
    .decrement("attempts_remained")
    .returning("attempts_remained");

  if (!result || !result[0]) {
    return 0;
  }

  return result[0].attempts_remained;
}

/**
 * @param {string} slug
 * @returns {Promise<object>}
 */
function getPlanBySlug(slug) {
  return db().select().from("plans").where("slug", slug).first();
}

/**
 * @param {number} userId
 * @param {number} planId
 * @param {number} months
 * @returns {Promise<void>}
 */
async function createUserSubscription(userId, planId, months) {
  await db()
    .insert({
      tg_user_id: userId,
      plan_id: planId,
      end_date: db().raw(
        `date_trunc('day', CURRENT_TIMESTAMP + interval '?? months')`,
        [months]
      ),
      updated_at: db().fn.now(),
    })
    .into("subscriptions");
}

/**
 * @param {number} userId
 * @returns {Promise<object | undefined>}
 */
function getSubscriptionByUser(userId) {
  return db()
    .select()
    .from("subscriptions")
    .where("tg_user_id", userId)
    .first();
}
