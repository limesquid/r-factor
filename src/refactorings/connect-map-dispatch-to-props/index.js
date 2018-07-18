const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class ConnectMapDispatchToProps extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.connect
    ];
  }

  canApply() {
    return true;
  }

  connect(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.connectDispatch().build();
  }
}

module.exports = ConnectMapDispatchToProps;
