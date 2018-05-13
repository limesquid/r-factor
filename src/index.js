const ConvertToComponent = require('./convert-to-component');

const convertToComponent = new ConvertToComponent();

module.exports = {
  canRefactor: (code) => convertToComponent.canApply(code),
  refactor: (code) => convertToComponent.refactor(code)
};
