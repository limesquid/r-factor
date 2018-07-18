const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const { Refactoring } = require('../../model');
const CodeBuilder = require('./code-builder');

class SortAttributes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorCode(code, ast)
    ];
  }

  canApply(code) {
    return this.getNumberOfObjects(code) > 0;
  }

  getNumberOfObjects(code, ast = parser.parse(code)) {
    let numberOfObjects = 0;

    const traverseCallback = () => {
      ++numberOfObjects;
    };

    traverse(ast, {
      ObjectExpression: traverseCallback,
      ObjectPattern: traverseCallback
    });

    return numberOfObjects;
  }

  refactorCode(code, ast) {
    const numberOfObjects = this.getNumberOfObjects(code, ast);
    let refactored = code;

    for (let i = 0; i < numberOfObjects; ++i) {
      refactored = this.refactorObject(refactored, parser.parse(refactored), i);
    }

    return refactored;
  }

  refactorObject(code, ast, objectIndex) {
    const builder = new CodeBuilder(code);
    let i = 0;

    const traverseCallback = (path) => {
      if (i === objectIndex) {
        builder.setNode(path.node);
        path.stop();
      }
      ++i;
    };

    traverse(ast, {
      ObjectExpression: traverseCallback,
      ObjectPattern: traverseCallback
    });

    return builder.build();
  }
}

module.exports = SortAttributes;
