import dotenv from "dotenv";

import { setupDatabase } from "./db/index.js";
import { setupOpenAi } from "./openai/index.js";
import { runTelegramBot } from "./telegram/index.js";

dotenv.config();

setupDatabase();
setupOpenAi();
runTelegramBot();
