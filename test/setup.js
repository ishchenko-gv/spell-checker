const { db, setupDatabase } = require("../db");
const { setupOpenAi } = require("../openai");

beforeAll(async () => {
  require("dotenv").config();

  setupDatabase();
  setupOpenAi();

  console.log("beforeAll.db", db());

  await db().migrate.latest();
  // await db.migrate.rollback();
  // await db().destroy();
});

beforeEach(async () => {
  // await db.seed.run();
});

afterEach(async () => {
  // await db.destroy();
});

afterAll(async () => {
  await db().migrate.rollback();
  await db().destroy();
});
