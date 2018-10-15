const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const FunctionComponentCompatibleRefactoring = require('../../model/function-component-compatible-refactoring');

class ConnectMapDispatchToProps extends FunctionComponentCompatibleRefactoring {
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
