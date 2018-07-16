const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class ConnectComponentWithDispatch extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.connectComponent
    ];
  }

  canApply() {
    return true;
  }

  connectComponent(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.connectDispatch().build();
  }
}

module.exports = ConnectComponentWithDispatch;