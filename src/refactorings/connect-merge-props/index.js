const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const ConnectRefactoring = require('../../model/connect-refactoring');

class ConnectMergeProps extends ConnectRefactoring {
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
    return reduxConnectBuilder.connectMergeProps().build();
  }
}

module.exports = ConnectMergeProps;
