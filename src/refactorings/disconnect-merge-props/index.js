const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectMergeProps extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.disconnect
    ];
  }

  canApply() {
    return true;
  }

  disconnect(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.disconnectMergeProps().build();
  }
}

module.exports = DisconnectMergeProps;
