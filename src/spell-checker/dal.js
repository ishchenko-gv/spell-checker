const { db } = require("../db");

module.exports = {
  createDefaultConfig,
  setUserLang,
  setUserLangLevel,
  setUserFormality,
  getUserConfig,
};

/**
 * @typedef {object} ConfigRecord
 * @property {string} lang
 * @property {string} lang_level
 */

/**
 * @param {number} userId
 * @returns {Promise<ConfigRecord>}
 */
async function createDefaultConfig(userId) {
  return db()
    .insert({
      tg_user_id: userId,
    })
    .into("config")
    .returning(["lang", "lang_level", "formality"]);
}

/**
 * @param {number} userId
 * @param {string} lang
 * @returns {Promise<void>}
 */
async function setUserLang(userId, lang) {
  await db()
    .insert({
      tg_user_id: userId,
      lang: lang,
    })
    .into("config")
    .onConflict("tg_user_id")
    .merge();
}

/**
 * @param {number} userId
 * @param {string} level
 * @returns {Promise<void>}
 */
async function setUserLangLevel(userId, level) {
  await db()
    .insert({
      tg_user_id: userId,
      lang_level: level,
    })
    .into("config")
    .onConflict("tg_user_id")
    .merge();
}

/**
 * @param {number} userId
 * @param {string} formality
 * @returns {Promise<void>}
 */
async function setUserFormality(userId, formality) {
  await db()
    .insert({
      tg_user_id: userId,
      formality,
    })
    .into("config")
    .onConflict("tg_user_id")
    .merge();
}

/**
 * @param {number} userId
 * @returns {Promise<ConfigRecord>}
 */
async function getUserConfig(userId) {
  return db()
    .select("lang", "lang_level", "formality")
    .from("config")
    .where({ tg_user_id: userId })
    .first();
}
