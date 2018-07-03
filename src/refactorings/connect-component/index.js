const traverse = require('@babel/traverse').default;
const parser = require('../../utils/parser');
const Imports = require('../../builders/imports');
const { Refactoring } = require('../../model');

class ConnectComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.connectComponent
    ];
  }

  canApply() {
    return true;
  }

  connectComponent(code) {
    const ast = parser.parse(code);
    return ''
  }
}

module.exports = ConnectComponent;
