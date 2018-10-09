const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const ConnectRefactoring = require('../../model/connect-refactoring');

class ConnectMapStateToProps extends ConnectRefactoring {
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
    return reduxConnectBuilder.connectState().build();
  }
}

module.exports = ConnectMapStateToProps;
