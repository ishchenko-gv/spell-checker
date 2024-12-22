/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("plans", function (table) {
      table.increments("id");
      table.timestamps(true, true);
      table.integer("duration_months").notNullable();
      table.integer("price_tg_stars").notNullable();
    })
    .createTable("subscriptions", function (table) {
      table.increments("id");
      table.timestamps(true, true);
      table.integer("tg_user_id").notNullable();
      table.timestamp("end_date");
      table
        .integer("plan_id")
        .references("id")
        .inTable("plans")
        .onDelete("restrict")
        .notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("subscriptions").dropTable("plans");
};
