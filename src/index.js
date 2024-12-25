require("dotenv").config();

const { setupDatabase } = require("./db");
const { setupOpenAi } = require("./openai");
const { runTelegramBot } = require("./telegram");

setupDatabase();
setupOpenAi();
runTelegramBot();
