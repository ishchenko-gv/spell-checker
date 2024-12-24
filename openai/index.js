const OpenAI = require("openai");

let _openai = null;

module.exports = {
  setupOpenAi,
  sendMessages,
};

function setupOpenAi() {
  _openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * @typedef {Object} Message
 * @prop {("user" | "developer")} role
 * @prop {String} content
 *
 * @typedef {Object} OpenAiResponse
 */

/**
 * Send message to OpenAI api
 *
 * @param {Message[]} messages
 *
 * @returns {Promise<OpenAiResponse>}
 */
function sendMessages(messages) {
  return _openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages,
  });
}
