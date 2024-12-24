import dotenv from "dotenv";

const { setupDatabase } = require("./db/index.js");
const { setupOpenAi } = require("./openai/index.js");
const { runTelegramBot } = require("./telegram/index.js");

dotenv.config();

setupDatabase();
setupOpenAi();
runTelegramBot();
