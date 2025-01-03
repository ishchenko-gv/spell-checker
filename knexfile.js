require("dotenv").config();

/**
 * @type { {[key: string]: import("knex").Knex.Config} }
 */
module.exports = {
  test: {
    client: "postgresql",
    connection: process.env.POSTGRES_CONNECTION_TEST,
    migrations: {
      tableName: "knex_migrations",
    },
  },

  development: {
    client: "postgresql",
    connection: process.env.POSTGRES_CONNECTION,
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: process.env.POSTGRES_CONNECTION,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.POSTGRES_CONNECTION,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
