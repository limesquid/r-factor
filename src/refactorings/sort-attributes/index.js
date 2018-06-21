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
    const ast = parser.parse(code, parser);
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
      const newAst = parser.parse(refactored);
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
