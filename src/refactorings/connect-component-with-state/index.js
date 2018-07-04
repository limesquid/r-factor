const traverse = require('@babel/traverse').default;
const parser = require('../../utils/parser');
const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class ConnectComponentWithState extends Refactoring {
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
    return reduxConnectBuilder.connectState().build();
  }
}

module.exports = ConnectComponentWithState;
