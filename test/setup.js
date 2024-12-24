import test from "node:test";
import dotenv from "dotenv";

import { db, setupDatabase } from "../db/index.js";
import { setupOpenAi } from "../openai/index.js";
// import { runTelegramBot } from "../telegram/index.js";

// let isDone = false;

// (() => {
//   if (isDone) {
//     return;
//   }

//   isDone = true;
// })();

test.before(async () => {
  dotenv.config();

  setupDatabase();
  setupOpenAi();

  await db.migrate.latest();
  // await db.migrate.rollback();
  await db.destroy();
});

test.beforeEach(async () => {
  // await db.seed.run();
});

test.afterEach(async () => {
  // await db.destroy();
});

test.after(async () => {
  await db.migrate.rollback();
  await db.destroy();
});
