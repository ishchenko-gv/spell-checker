const {
  checkSpelling,
  setUserLang,
  setUserLangLevel,
  getUserConfig,
} = require("../src/spell-checker");
const { getRandomUserId } = require("./utils");

describe("spell-checker", () => {
  it("should check the spelling using OpenAI api", async () => {
    const userId = getRandomUserId();
    const response = await checkSpelling(userId, "Hello there!");

    console.info("OpenAI response:", response);

    expect(typeof response).toBe("string");
  });

  it("should set user language config", async () => {
    const userId = getRandomUserId();

    await setUserLang(userId, "de");
    await setUserLangLevel(userId, "a1");

    const config = await getUserConfig(userId);

    expect(config.lang).toBe("de");
    expect(config.langLevel).toBe("a1");
  });
});
