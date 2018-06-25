const babylon = require('@babel/parser');
const { babylonOptions } = require('../options');

class Refactoring {
  constructor(transformations = []) {
    this.transformations = transformations;
  }

  canApply() {
    return false;
  }

  getTransformations() {
    return this.transformations;
  }

  refactor(code) {
    try {
      babylon.parse(code, babylonOptions);
    } catch (error) {
      return [
        'Parsing failure - syntax error'
      ].join('\n');
    }

    return this.getTransformations(code).reduce(
      (nextCode, transformation) => {
        try {
          const ast = babylon.parse(nextCode, babylonOptions);
          return transformation(nextCode, ast);
        } catch (error) {
          return [
            'Exception occured while performing a transformation.',
            error,
            `Code: ${nextCode}`
          ].join('\n');
        }
      },
      code
    );
  }

  refactorIfPossible(code, ast) {
    if (this.canApply(code, ast)) {
      return this.refactor(code, ast);
    }
    return code;
  }
}

module.exports = Refactoring;
