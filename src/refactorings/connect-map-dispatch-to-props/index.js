const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const ConnectRefactoring = require('../../model/connect-refactoring');

class ConnectMapDispatchToProps extends ConnectRefactoring {
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
