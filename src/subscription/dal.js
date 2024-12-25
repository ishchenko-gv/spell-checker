const { db } = require("../db");

const MAX_FREE_ATTEMPTS = 3;

module.exports = {
  getAttemptsByUserId,
  createAttemptsForUser,
  getDaysSinceLastAttempt,
  decrementFreeAttempts,
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
  const attemptsRemained = MAX_FREE_ATTEMPTS - 1;

  await db()
    .insert({
      tg_user_id: userId,
      attempts_remained: attemptsRemained,
      last_attempt_ts: db().fn.now(),
      updated_at: db().fn.now(),
    })
    .into("free_attempts");

  return attemptsRemained;
}

/**
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function getDaysSinceLastAttempt(userId) {
  const result = await db()
    .select(db().raw("EXTRACT(DAY FROM AGE(now(), last_attempt_ts))"))
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
