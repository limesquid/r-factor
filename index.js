const globalSettings = require('./src/settings');
const refactorings = require('./src/refactorings');

module.exports = ({ code, refactoring, settings = {} }) => {
  const refactoringMethod = new refactorings[refactoring]();

  globalSettings.revert();
  globalSettings.set(settings);

  if (refactoringMethod.canApply(code)) {
    return refactoringMethod.refactor(code);
  }

  return code;
};
