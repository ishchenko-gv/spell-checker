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
async function getAttemptsByUserId(userId) {
  const result = await db()
    .select("*")
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();

  if (!result) {
    return;
  }

  return result.attempts_remained;
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
async function getDaysSinceLastAttempt(userId) {
  const result = await db()
    .select(db().raw("EXTRACT(DAY FROM AGE(now(), last_attempt_ts))"))
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();

  console.info("typeof result.extract", typeof result.extract);

  if (!result) {
    return 0;
  }

  return Number(result.extract);
}

/**
 * @param {number} userId
 * @returns {Promise<void>}
 */
function decrementFreeAttempts(userId) {
  return db()
    .select()
    .from("free_attempts")
    .where("tg_user_id", userId)
    .decrement("attempts_remained");
}

/**
 * @param {number} userId
 * @returns {Promise<number>} amount of free attempts remained
 */
async function checkFreeAttempts(userId) {
  const attempts = await getAttemptsByUserId(userId);

  if (attempts === undefined || (await getDaysSinceLastAttempt(userId)) > 0) {
    await createAttemptsForUser(userId);
    return MAX_FREE_ATTEMPTS - 1;
  }

  console.log("checkFreeAttempts.attempts", attempts);

  if (!attempts) {
    return 0;
  }

  await decrementFreeAttempts(userId);

  return attempts;
}
