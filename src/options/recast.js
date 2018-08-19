const settings = require('../settings');

module.exports = () => ({
  lineTerminator: settings.endOfLine,
  tabWidth: settings.indent,
  trailingComma: settings.trailingComma === ',',
  useTabs: settings.indentCharacter === '\t'
});
