const globalSettings = require('./src/settings');
const refactorings = require('./src/refactorings');
const verifyLicense = require('./src/license/verify');

const WARMUP_CODE = `
import React from 'react';

const Component = ({ children, onClick }) => (
  <div onClick={onClick}>
    {children}
  </div>
);

export default Component;
`;

const warmup = () => {
  const GeneratePropTypes = refactorings['generate-prop-types'];
  const generatePropTypes = new GeneratePropTypes();
  return generatePropTypes.refactor(WARMUP_CODE);
};

warmup();

module.exports = ({ code, license, refactoring, settings }) => {
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
