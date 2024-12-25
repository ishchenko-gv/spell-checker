const { db } = require("../db");

const MAX_FREE_ATTEMPTS = 3;

module.exports = {
  getAttemptsByUserId,
  createAttemptsForUser,
  getDaysSinceLastAttempt,
  checkFreeAttempts,
};

/**
 * @typedef {import('knex').Knex.QueryBuilder} QueryBuilder
 */

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
function getAttemptsByUserId(userId) {
  return db()
    .select("*")
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();
}

/**
 * @param {number} userId
 * @returns {Promise<QueryBuilder>}
 */
function createAttemptsForUser(userId) {
  return db()
    .insert({
      tg_user_id: userId,
      attempts_remained: MAX_FREE_ATTEMPTS - 1,
      last_attempt_ts: db().fn.now(),
      updated_at: db().fn.now(),
    })
    .into("free_attempts");
}

/**
 * @param {number} userId
 * @returns {Promise<number>}
 */
function getDaysSinceLastAttempt(userId) {
  return db()
    .select(db().raw("EXTRACT(DAY FROM AGE(now(), last_attempt_ts))"))
    .from("free_attempts")
    .where("tg_user_id", userId);
}

/**
 * @param {number} userId
 * @returns {void}
 */
async function checkFreeAttempts(userId) {
  const attempts = await getAttemptsByUserId(userId);

  if (attempts === undefined) {
    await createAttemptsForUser(userId);
  }

  console.log("checkFreeAttempts.attempts", attempts);
}
