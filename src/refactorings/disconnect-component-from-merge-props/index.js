const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectComponentFromMergeProps extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.disconnectComponentFromMergeProps
    ];
  }

  canApply() {
    return true;
  }

  disconnectComponentFromMergeProps(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.disconnectMergeProps().build();
  }
}

module.exports = DisconnectComponentFromMergeProps;
