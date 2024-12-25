require("dotenv").config();

const { db, setupDatabase } = require("../src/db");
const { setupOpenAi } = require("../src/openai");

beforeAll(async () => {
  setupDatabase();
  setupOpenAi();

  await db().migrate.latest();
});

beforeEach(async () => {
  await db().seed.run();
});

afterAll(async () => {
  await db().migrate.rollback();
  await db().destroy();
});
