const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectMapDispatchToProps extends Refactoring {
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
    return reduxConnectBuilder.disconnectDispatch().build();
  }
}

module.exports = DisconnectMapDispatchToProps;
