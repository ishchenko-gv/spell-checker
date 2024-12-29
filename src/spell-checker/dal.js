const { db } = require("../db");

/**
 * @typedef {import('./typedefs').Config} Config
 */

module.exports = {
  setUserLang,
  setUserLangLevel,
  getUserConfig,
};

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
 * @returns {Promise<Config>}
 */
async function getUserConfig(userId) {
  const record = await db()
    .select("lang", "lang_level")
    .from("config")
    .where({ tg_user_id: userId })
    .first();

  return {
    lang: record.lang,
    langLevel: record.lang_level,
  };
}
