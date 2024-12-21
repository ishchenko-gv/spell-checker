import dotenv from "dotenv";

import { runTelegramBot } from "./telegram/index.js";
import { setupOpenAi } from "./openai/index.js";

dotenv.config();

setupOpenAi();
runTelegramBot();
