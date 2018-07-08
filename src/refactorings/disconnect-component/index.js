const ReduxConnectBuilder = require('../../builders/redux-connect-builder');
const { Refactoring } = require('../../model');

class DisconnectComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.disconnectComponent
    ];
  }

  canApply() {
    return true;
  }

  disconnectComponent(code, ast) {
    const reduxConnectBuilder = new ReduxConnectBuilder(code, ast);
    return reduxConnectBuilder.disconnect().build();
  }
}

module.exports = DisconnectComponent;
