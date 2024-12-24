import knex from "knex";

import knexConfig from "../knexfile.js";

/**
 * @type {import("knex").Knex}
 */
export let db;

export function setupDatabase() {
  db = knex(knexConfig[process.env.NODE_ENV]);
}
