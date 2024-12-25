const TelegramBot = require("node-telegram-bot-api");

const { checkSpelling } = require("../spell-checker");
const {
  checkFreeAttempts,
  validatePlanSlug,
  subscribeUser,
  checkUserSubscription,
} = require("../subscription");
const { ErrorCodes } = require("../errors");

/**
 * @typedef {import('node-telegram-bot-api').TelegramBot} TelegramBot
 * @typedef {import('node-telegram-bot-api').CallbackQuery} CallbackQuery
 */

/**
 * @type {TelegramBot}
 */
let _bot;

const commands = {
  SUBSCRIBE_MONTH: "subscribe_month",
  SUBSCRIBE_YEAR: "subscribe_year",
};

module.exports = {
  runTelegramBot,
};

/**
 * Run Telegram bot instance
 */
function runTelegramBot() {
  const token = process.env.TELEGRAM_API_KEY;

  _bot = new TelegramBot(token, {
    testEnvironment: process.env.NODE_ENV === "development",
    polling: true,
  });

  _bot.on("polling_error", createErrorHandler("polling_error"));
  _bot.on("message", handleMessage);
  _bot.on("callback_query", handleCallbackQuery);
  _bot.on("pre_checkout_query", handlePrecheckoutQuery);
  _bot.on("successful_payment", handleSuccessfulPayment);

  if (process.env.NODE_ENV === "development") {
    _bot.onText(/\/test_offer/, offerSubscription);
    _bot.onText(/\/test_subscribe/, (msg) => {
      const userId = msg.from.id;
      subscribeUser(userId, "month_plan");
      _bot.sendMessage(userId, "You've been subscribed for 1 month!");
    });
  }
}

/**
 * @param {TelegramBot.Message} msg
 * @returns {void}
 */
async function handleMessage(msg) {
  if (msg.text.startsWith("/")) {
    return;
  }

  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const isUserSubscribed = await checkUserSubscription(userId);

    if (!isUserSubscribed) {
      const freeAttemptsRemained = await checkFreeAttempts(userId);

      if (!freeAttemptsRemained) {
        offerSubscription(msg);
        return;
      }
    }
  } catch (err) {
    console.error(err);
    _bot.sendMessage(chatId, "Something went wrong. Couldn't read message");
  }

  const answer = await checkSpelling(msg.text);

  _bot.sendMessage(chatId, answer);
}

/**
 * @param {string} errorName
 * @returns {(error: Error) => void}
 */
function createErrorHandler(errorName) {
  return (error) => {
    console.log(`[${errorName}] ${error.code}: ${error.message}`);
  };
}

/**
 * @param {CallbackQuery} callbackQuery
 */
function handleCallbackQuery(callbackQuery) {
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
}

/**
 * @param {TelegramBot.PreCheckoutQuery} query
 * @returns {void}
 */
function handlePrecheckoutQuery(query) {
  const chatId = query.from.id;
  const planSlug = query.invoice_payload;

  if (!validatePlanSlug(planSlug)) {
    _bot.answerPreCheckoutQuery(query.id, false);
    _bot.sendMessage(chatId, "Something went wrong. You've not been charged");
    console.error("Invalid plan slug:", planSlug);
    return;
  }

  _bot.answerPreCheckoutQuery(query.id, true);
}

/**
 * @param {TelegramBot.Message} msg
 * @returns {Promise<void>}
 */
async function handleSuccessfulPayment(msg) {
  const userId = msg.from.id;
  const planSlug = msg.successful_payment.invoice_payload;

  try {
    await subscribeUser(userId, planSlug);
  } catch (err) {
    if (err.code === ErrorCodes.SUBSCRIPTION_EXISTS) {
      _bot.sendMessage(userId, "You've already subscribed!");
    } else {
      console.error(err);
    }
  }
}

/**
 * @param {TelegramBot.Message} msg
 */
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

/**
 * @param {number} chatId
 * @returns {object}
 */
function getMonthSubscriptionInvoice(chatId) {
  return {
    chatId,
    title: "Subscription",
    description: "Get 1 month access",
    payload: "month_plan",
    providerToken: "",
    currency: "XTR",
    prices: [
      {
        label: "1 month",
        amount: 1,
      },
    ],
  };
}

/**
 * @param {number} chatId
 * @returns {object}
 */
function getYearSubscriptionInvoice(chatId) {
  return {
    chatId,
    title: "Subscription",
    description: "Get 12 months access",
    payload: "year_plan",
    providerToken: "",
    currency: "XTR",
    prices: [
      {
        label: "1 year",
        amount: 1,
      },
    ],
  };
}
