const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectComponentFromState extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.disconnectComponentFromState
    ];
  }

  canApply() {
    return true;
  }

  disconnectComponentFromState(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.disconnectState().build();
  }
}

module.exports = DisconnectComponentFromState;
