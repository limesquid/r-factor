const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const ComponentBuilder = require('./component-builder');

class AddClassname extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorCode(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasObjects = false;

    traverse(ast, {

    });

    return hasObjects;
  }

  refactorCode(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {

    });

    return builder.build();
  }
}

module.exports = AddClassname;
