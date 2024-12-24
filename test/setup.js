const { db, setupDatabase } = require("../db");
const { setupOpenAi } = require("../openai");

beforeAll(async () => {
  require("dotenv").config();

  setupDatabase();
  setupOpenAi();

  await db().migrate.latest();
});

beforeEach(async () => {
  // await db.seed.run();
});

afterAll(async () => {
  await db().migrate.rollback();
  await db().destroy();
});
