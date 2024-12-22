import knex from "knex";

export let db;

export function setupDatabase() {
  db = knex({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ["knex", "public"],
  });
}
