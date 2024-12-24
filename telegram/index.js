const TelegramBot = require("node-telegram-bot-api");
const { checkSpelling } = require("../spell-checker/index.js");

let _bot;

const commands = {
  SUBSCRIBE_MONTH: "subscribe_month",
  SUBSCRIBE_YEAR: "subscribe_year",
};

module.exports = {
  runTelegramBot,
  offerSubscription,
};

function runTelegramBot() {
  const token = process.env.TELEGRAM_API_KEY;

  _bot = new TelegramBot(token, { polling: true });

  _bot.on("polling_error", (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
  });

  _bot.onText(/\/test_offer/, (msg) => {
    offerSubscription(msg);
  });

  _bot.on("message", async (msg) => {
    if (msg.text.startsWith("/")) {
      return;
    }

    const chatId = msg.chat.id;
    const answer = await checkSpelling(msg.text);

    _bot.sendMessage(chatId, answer);
  });

  _bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const command = callbackQuery.data;

    switch (command) {
      case commands.SUBSCRIBE_MONTH:
        _bot.sendInvoice(...Object.values(getMonthSubscriptionInvoice(chatId)));
        break;
      case commands.SUBSCRIBE_YEAR:
        _bot.sendInvoice(...Object.values(getYearSubscriptionInvoice(chatId)));
        break;
      default:
        console.error("Unknown callback query:", command);
    }
  });
}

function offerSubscription(msg) {
  const chatId = msg.chat.id;

  _bot.sendMessage(chatId, "Choose subscription plan:", {
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
