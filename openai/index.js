const OpenAI = require("openai");

/**
 * @typedef {import('openai').OpenAI} OpenAI
 * @typedef {import('openai').OpenAI.ChatCompletion} ChatCompletion
 */

/**
 * @type {OpenAI}
 */
let _openai = null;

module.exports = {
  setupOpenAi,
  sendMessages,
};

/**
 * Define OpenAI instance
 */
function setupOpenAi() {
  _openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * @typedef {object} Message
 * @property {("user" | "developer")} role
 * @property {string} content
 */

/**
 * Send message to OpenAI api
 * @param {Message[]} messages
 * @returns {Promise<ChatCompletion>}
 */
function sendMessages(messages) {
  return _openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages,
  });
}
