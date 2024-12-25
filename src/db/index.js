const knex = require("knex");

const knexConfig = require("../../knexfile.js");

/**
 * @typedef {import("knex").Knex} Database
 */

/**
 * @type {Database}
 */
let _db;

module.exports = {
  db,
  setupDatabase,
};

/**
 * Define database instance
 */
function setupDatabase() {
  _db = knex(knexConfig[process.env.NODE_ENV || "development"]);
}

/**
 * Get database instance
 * @returns {Database}
 */
function db() {
  return _db;
}
