const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const CodeBuilder = require('./code-builder');

class SortAttributes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorRecursive(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasObjects = false;

    traverse(ast, {
      ObjectExpression() {
        hasObjects = true;
      },
      ObjectPattern() {
        hasObjects = true;
      }
    });

    return hasObjects;
  }

  refactorRecursive(code, ast) {
    let refactored = code;
    let lastCode = code;
    refactored = this.refactorCode(code, ast);
    while (refactored !== lastCode) {
      lastCode = refactored;
      const newAst = babylon.parse(refactored, babylonOptions);
      refactored = this.refactorCode(refactored, newAst);
    }
    return refactored;
  }

  refactorCode(code, ast) {
    const builder = new CodeBuilder(code);

    traverse(ast, {
      ObjectExpression({ node }) {
        builder.addNode(node);
      },
      ObjectPattern({ node }) {
        builder.addNode(node);
      }
    });

    return builder.build();
  }
}

module.exports = SortAttributes;
