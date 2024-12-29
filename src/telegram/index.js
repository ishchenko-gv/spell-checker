const TelegramBot = require("node-telegram-bot-api");

const { checkSpelling } = require("../spell-checker");
const {
  checkFreeAttempts,
  validatePlanSlug,
  subscribeUser,
  checkUserSubscription,
} = require("../subscription");
const { createPayment } = require("../subscription/dal");

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
  _bot.onText(/\/me/, handleAboutMe);

  if (process.env.NODE_ENV === "development") {
    _bot.onText(/\/test_offer/, offerSubscription);

    _bot.onText(/\/test_subscribe/, (msg) => {
      msg.successful_payment = {
        id: 1,
        telegram_payment_charge_id: 2,
        invoice_payload: "month_plan",
        currency: "XTR",
        total_amount: 100,
      };

      handleSuccessfulPayment(msg);
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
    console.error(`[${errorName}] ${error.code}: ${error.message}`);
  };
}

/**
 * @param {TelegramBot.CallbackQuery} callbackQuery
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
async function handlePrecheckoutQuery(query) {
  const userId = query.from.id;
  const chatId = query.chat.id;
  const planSlug = query.invoice_payload;

  if (!validatePlanSlug(planSlug)) {
    await createPayment({
      userId,
      status: "pre_checkout_failed",
      subject: "subscription",
      currency: query.currency,
      amount: query.total_amount,
      details: {
        pre_checkout_id: query.id,
        error: `Invalid plan slug: ${planSlug}`,
      },
    });
    _bot.answerPreCheckoutQuery(query.id, false);
    _bot.sendMessage(chatId, "Something went wrong. You've not been charged");
    console.error("Invalid plan slug:", planSlug);
    return;
  }

  await createPayment({
    userId,
    status: "pre_checkout_success",
    subject: "subscription",
    currency: query.currency,
    amount: query.total_amount,
    details: {
      pre_checkout_id: query.id,
    },
  });

  _bot.answerPreCheckoutQuery(query.id, true);
}

/**
 * @param {TelegramBot} msg
 * @returns {Promise<void>}
 */
async function handleSuccessfulPayment(msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const planSlug = msg.successful_payment.invoice_payload;

  try {
    const paymentId = await createPayment({
      userId,
      status: "success",
      subject: "subscription",
      currency: msg.successful_payment.currency,
      amount: msg.successful_payment.total_amount,
      details: {
        charge_id: msg.successful_payment.telegram_payment_charge_id,
      },
    });

    await subscribeUser(userId, planSlug, paymentId);
    _bot.sendMessage(chatId, "You've been subscribed successfully!");
  } catch (err) {
    console.error(err);
    _bot.sendMessage(chatId, "Something went wrong. Couldn't process payment");
  }
}

/**
 * @param {TelegramBot.Message} msg
 */
function handleAboutMe(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const response = `
    user id: ${userId}
  `;

  _bot.sendMessage(chatId, response);
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
