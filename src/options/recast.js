const settings = require('../settings');

module.exports = () => ({
  lineTerminator: settings.endOfLine,
  tabWidth: settings.indent,
  useTabs: settings.indentCharacter === '\t'
});
