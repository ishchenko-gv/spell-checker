const commands = require("./commands");
const languages = require("../spell-checker/languages");
const langLevels = require("../spell-checker/lang-levels");
const formalities = require("../spell-checker/formalities");

const showSettings = [
  [
    {
      text: "⚙️ Show settings",
      callback_data: commands.SHOW_SETTINGS,
    },
  ],
];

const changeSettings = [
  [
    { text: "language", callback_data: commands.CHANGE_LANG },
    { text: "level", callback_data: commands.CHANGE_LANG_LEVEL },
    { text: "formality", callback_data: commands.CHANGE_FORMALITY },
  ],
];

const chooseLanguage = [
  [
    {
      text: `${languages["en-uk"].emoji} ${languages["en-uk"].label}`,
      callback_data: commands.CHANGE_LANG + ":en-uk",
    },
    {
      text: `${languages["en-us"].emoji} ${languages["en-us"].label}`,
      callback_data: commands.CHANGE_LANG + ":en-us",
    },
  ],
  [
    {
      text: `${languages["de"].emoji} ${languages["de"].label}`,
      callback_data: commands.CHANGE_LANG + ":de",
    },
  ],
  [
    {
      text: `${languages["fr"].emoji} ${languages["fr"].label}`,
      callback_data: commands.CHANGE_LANG + ":fr",
    },
  ],
  [
    {
      text: `${languages["ru"].emoji} ${languages["ru"].label}`,
      callback_data: commands.CHANGE_LANG + ":ru",
    },
  ],
];

const chooseLevel = [
  [
    {
      text: `${langLevels.b2.emoji} ${langLevels.b2.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":b2",
    },
    {
      text: `${langLevels.c1.emoji} ${langLevels.c1.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":c1",
    },
  ],
  [
    {
      text: `${langLevels.c2.emoji} ${langLevels.c2.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":c2",
    },
    {
      text: `${langLevels.b1.emoji} ${langLevels.b1.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":b1",
    },
    {
      text: `${langLevels.a2.emoji} ${langLevels.a2.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":a2",
    },
    {
      text: `${langLevels.a1.emoji} ${langLevels.a1.label}`,
      callback_data: commands.CHANGE_LANG_LEVEL + ":a1",
    },
  ],
];

const chooseFormality = [
  [
    {
      text: `${formalities.formal.emoji} ${formalities.formal.label}`,
      callback_data: commands.CHANGE_FORMALITY + ":formal",
    },
  ],
  [
    {
      text: `${formalities.informal.emoji} ${formalities.informal.label}`,
      callback_data: commands.CHANGE_FORMALITY + ":informal",
    },
  ],
  [
    {
      text: `${formalities.urban.emoji} ${formalities.urban.label}`,
      callback_data: commands.CHANGE_FORMALITY + ":urban",
    },
  ],
];

module.exports = {
  showSettings,
  changeSettings,
  chooseLanguage,
  chooseLevel,
  chooseFormality,
};
