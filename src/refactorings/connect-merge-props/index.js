const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class ConnectMergeProps extends Refactoring {
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
