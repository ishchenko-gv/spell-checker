import dotenv from "dotenv";

const { setupDatabase } = require("./db");
const { setupOpenAi } = require("./openai");
const { runTelegramBot } = require("./telegram");

dotenv.config();

setupDatabase();
setupOpenAi();
runTelegramBot();
