/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("config", function (t) {
    t.increments("id");
    t.timestamps(true, true);
    t.bigInteger("tg_user_id").notNullable().unique();
    t.string("lang").notNullable().defaultTo("en");
    t.string("lang_level").notNullable().defaultTo("b2");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("config");
};
