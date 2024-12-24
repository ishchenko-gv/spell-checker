import { db } from "../db/index.js";

const MAX_FREE_ATTEMPTS = 3;

export function getAttemptsByUserId(userId) {
  return db
    .select("*")
    .from("free_attempts")
    .where("tg_user_id", userId)
    .first();
}

export function createAttemptsForUser(userId) {
  return db
    .insert({
      tg_user_id: userId,
      attempts_remained: MAX_FREE_ATTEMPTS - 1,
      last_attempt_ts: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .into("free_attempts");
}

export function getDaysSinceLastAttempt(userId) {
  return db
    .select(db.raw("EXTRACT(DAY FROM AGE(now(), last_attempt_ts))"))
    .from("free_attempts")
    .where("tg_user_id", userId);
}

/**
 * @param {Number} userId
 */
export async function checkFreeAttempts(userId) {
  const attempts = await getAttemptsByUserId(userId);

  if (attempts === undefined) {
    await createAttemptsForUser(userId);
  }

  console.log("checkFreeAttempts.attempts", attempts);
}
