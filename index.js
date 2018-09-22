const globalSettings = require('./src/settings');
const refactorings = require('./src/refactorings');
const verifyLicense = require('./src/license/verify');

module.exports = ({ code, license, refactoring, settings = {} }) => {
  if (!verifyLicense(license)) {
    throw 'Invalid license';
  }

  const refactoringMethod = new refactorings[refactoring]();

  globalSettings.revert();
  globalSettings.set(settings);

  if (refactoringMethod.canApply(code)) {
    return refactoringMethod.refactor(code);
  }

  return code;
};
