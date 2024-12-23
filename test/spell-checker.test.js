const { checkSpelling } = require("../spell-checker/index.js");

describe("spell-checker", () => {
  it("should preform OpenAI api call", async () => {
    const response = await checkSpelling("Hello there!");

    console.log("OpenAI response:", response);

    expect(typeof response).toBe("string");
  });
});
