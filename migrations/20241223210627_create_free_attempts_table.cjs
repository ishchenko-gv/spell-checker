/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("free_attempts", function (table) {
    table.increments();
    table.timestamps(true, true);
    table.integer("tg_user_id");
    table.integer("attempts_remained");
    table.timestamp("last_attempt_ts");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("free_attempts");
};
