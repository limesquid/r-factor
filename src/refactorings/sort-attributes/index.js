const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
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
    const ast = parser.parse(code);
    let hasObjects = false;

    traverse(ast, {
      ObjectExpression(path) {
        hasObjects = true;
        path.stop();
      },
      ObjectPattern(path) {
        hasObjects = true;
        path.stop();
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
      const newAst = parser.parse(refactored);
      refactored = this.refactorCode(refactored, newAst);
    }
    return refactored;
  }

  refactorCode(code, ast) {
    const builder = new CodeBuilder(code);

    traverse(ast, {
      ObjectExpression(path) {
        builder.setNode(path.node);
        path.stop();
      },
      ObjectPattern(path) {
        builder.setNode(path.node);
        path.stop();
      }
    });

    return builder.build();
  }
}

module.exports = SortAttributes;
