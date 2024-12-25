const globals = require("globals");
const pluginJs = require("@eslint/js");
const jsdoc = require("eslint-plugin-jsdoc");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  jsdoc.configs["flat/recommended-error"],
  {
    rules: {
      "jsdoc/check-param-names": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-param-type": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/require-property-description": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
    },
    // plugins: ["jsdoc"],
  },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  pluginJs.configs.recommended,
];
