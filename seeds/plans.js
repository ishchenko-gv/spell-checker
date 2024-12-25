/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("plans").del();
  await knex("plans").insert([
    {
      id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      duration_months: 1,
      price_tg_stars: 10,
    },
    {
      id: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      duration_months: 10,
      price_tg_stars: 100,
    },
  ]);
};
