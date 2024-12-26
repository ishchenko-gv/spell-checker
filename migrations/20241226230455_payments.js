/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("payments", function (t) {
    t.increments("id");
    t.timestamps(true, true);
    t.string("status").notNullable();
    t.bigInteger("tg_user_id").notNullable();
    t.string("subject").notNullable();
    t.string("currency").notNullable();
    t.integer("amount").notNullable();
    t.jsonb("details");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};
