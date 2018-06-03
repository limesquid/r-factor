const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const { addImportDeclaration, addPropTypes } = require('../../transformations');
const ComponentBuilder = require('./component-builder');

class AddClassname extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorCode(code, ast),
      (code, ast) => addImportDeclaration(code, ast, {
        module: 'prop-types',
        identifier: 'PropTypes'
      }),
      (code, ast) => addPropTypes(code, ast, {
        className: 'PropTypes.string'
      })
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);

    traverse(ast, {

    });

    return false;
  }

  refactorCode(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {

    });

    return builder.build();
  }
}

module.exports = AddClassname;
