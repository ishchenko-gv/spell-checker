/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("subscriptions", function (t) {
      t.bigInteger("tg_user_id").alter();
    })
    .alterTable("free_attempts", function (t) {
      t.bigInteger("tg_user_id").alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("subscriptions", function (t) {
      t.integer("tg_user_id").alter();
    })
    .alterTable("free_attempts", function (t) {
      t.integer("tg_user_id").alter();
    });
};
