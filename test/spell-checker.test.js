import "./setup.js";

import { describe, it } from "node:test";
import assert from "node:assert";

import { checkSpelling } from "../spell-checker/index.js";

describe("spell-checker", () => {
  it("should preform OpenAI api call", async () => {
    const response = await checkSpelling("Hello there!");
    const content = response.choices[0].message.content;

    console.log("OpenAI response:", content);

    assert.equal(typeof content, "string");
  });
});
