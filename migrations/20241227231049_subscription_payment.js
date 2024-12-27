/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("subscriptions", function (t) {
    t.integer("payment_id").references("id").inTable("payments");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("subscriptions", function (t) {
    t.dropColumn("payment_id");
  });
};
