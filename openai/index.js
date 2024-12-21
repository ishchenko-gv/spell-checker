import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

/**
 * typedef {Object} Message
 * @prop {("user" | "developer")} role
 * @prop {String} content
 *
 * typedef {Object} OpenAiResponse
 */

/**
 * Send message to OpenAI api
 *
 * @param {Message[]} messages
 *
 * @returns {Promise<OpenAiResponse>}
 */
export function sendMessages(messages) {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages,
  });
}
