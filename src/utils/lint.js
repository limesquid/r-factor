const CLIEngine = require('eslint').CLIEngine;
const { eslintOptions } = require('../options');

const lint = (code, rules, options = {}) => {
  const cli = new CLIEngine({
    ...eslintOptions,
    ...options,
    rules: {
      ...eslintOptions.rules,
      ...options.rules,
      ...rules
    }
  });
  const { messages } = cli.executeOnText(code).results[0];

  return messages;
};

module.exports = lint;
