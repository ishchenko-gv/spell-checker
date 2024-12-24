import dotenv from "dotenv";

dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
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
