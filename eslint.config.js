const globals = require("globals");
const pluginJs = require("@eslint/js");
const jsdoc = require("eslint-plugin-jsdoc");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  jsdoc.configs["flat/recommended-error"],
  {
    rules: {
      "require-property-description": "off",
    },
  },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  pluginJs.configs.recommended,
];
