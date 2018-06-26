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

    const transformations = this.getTransformations(code);
    let nextCode = code;

    for (const transformation of transformations) {
      try {
        const ast = babylon.parse(nextCode, babylonOptions);
        nextCode = transformation(nextCode, ast);
      } catch (error) {
        return [
          'Exception occured while performing a transformation.',
          error,
          `Code: ${nextCode}`
        ].join('\n');
      }
    }

    return nextCode;
  }

  refactorIfPossible(code, ast) {
    if (this.canApply(code, ast)) {
      return this.refactor(code, ast);
    }
    return code;
  }
}

module.exports = Refactoring;
