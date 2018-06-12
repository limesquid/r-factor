const CLIEngine = require('eslint').CLIEngine;
const { eslintOtions } = require('../options');

const lint = (code, rules, additionalOptions = {}) => {
  const cli = new CLIEngine({
    ...eslintOtions,
    ...additionalOptions,
    rules: {
      ...eslintOtions.rules,
      ...additionalOptions.rules,
      ...rules
    }
  });
  const { messages } = cli.executeOnText(code).results[0];

  return messages;
}

module.exports = lint;
