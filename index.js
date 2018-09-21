const globalSettings = require('./src/settings');
const refactorings = require('./src/refactorings');
const verifyLicense = require('./src/license/verify');

const WARMUP_CODE = `
import React, { Component } from 'react';

class WarmUp extends Component {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    const { children } = this.props;

    return (
      <div>{children}</div>
    );
  }
}

export default WarmUp;
`;

const warmUp = () => {
  const GeneratePropTypes = refactorings['generate-prop-types'];
  const generatePropTypes = new GeneratePropTypes();
  return generatePropTypes.refactor(WARMUP_CODE);
};

warmUp();

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
