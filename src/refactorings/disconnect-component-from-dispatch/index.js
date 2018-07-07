const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectComponentFromDispatch extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.disconnectComponentFromDispatch
    ];
  }

  canApply() {
    return true;
  }

  disconnectComponentFromDispatch(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.disconnectDispatch().build();
  }
}

module.exports = DisconnectComponentFromDispatch;
