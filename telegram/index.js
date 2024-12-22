import TelegramBot from "node-telegram-bot-api";
import { checkSpelling } from "../spell-checker/index.js";

let bot;

const commands = {
  SUBSCRIBE_MONTH: "subscribe_month",
  SUBSCRIBE_YEAR: "subscribe_year",
};

export function runTelegramBot() {
  // replace the value below with the Telegram token you receive from @BotFather
  const token = process.env.TELEGRAM_API_KEY;

  // Create a bot that uses 'polling' to fetch new updates
  bot = new TelegramBot(token, { polling: true });

  bot.on("polling_error", (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
  });

  bot.onText(/\/test_offer/, (msg) => {
    offerSubscription(bot, msg);
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on("message", async (msg) => {
    console.log("MSG", msg);
    if (msg.text.startsWith("/")) {
      return;
    }

    const chatId = msg.chat.id;
    const answer = await checkSpelling(msg.text);

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, answer);
  });

  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const command = callbackQuery.data;

    switch (command) {
      case commands.SUBSCRIBE_MONTH:
        bot.sendInvoice(...Object.values(getMonthSubscriptionInvoice(chatId)));
        break;
      case commands.SUBSCRIBE_YEAR:
        bot.sendInvoice(...Object.values(getYearSubscriptionInvoice(chatId)));
        break;
      default:
        console.error("Unknown callback query:", command);
    }
  });
}

export function offerSubscription(bot, msg) {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Choose subscription plan:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "1 month", callback_data: commands.SUBSCRIBE_MONTH }],
        [{ text: "12 months", callback_data: commands.SUBSCRIBE_YEAR }],
      ],
    },
  });
}

function getMonthSubscriptionInvoice(chatId) {
  return {
    chatId,
    title: "Subscription",
    description: "Get 1 month access",
    payload: "month_subscription",
    providerToken: "",
    currency: "XTR",
    prices: [
      {
        label: "1 month",
        amount: 10,
      },
    ],
  };
}

function getYearSubscriptionInvoice(chatId) {
  return {
    chatId,
    title: "Subscription",
    description: "Get 12 months access",
    payload: "year_subscription",
    providerToken: "",
    currency: "XTR",
    prices: [
      {
        label: "1 year",
        amount: 100,
      },
    ],
  };
}
