const knex = require("knex");

const knexConfig = require("../knexfile.js");

/**
 * @type {import("knex").Knex}
 */
let _db;

module.exports = {
  db,
  setupDatabase,
};

function setupDatabase() {
  _db = knex(knexConfig[process.env.NODE_ENV]);
  console.log("setupDatabase.db", db, process.env.NODE_ENV);
}

function db() {
  return _db;
}
