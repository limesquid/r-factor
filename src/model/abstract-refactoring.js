const babylon = require('babylon');
const { babylonOptions } = require('../options');

class AbstractRefactoring {
  constructor(transformations) {
    this.transformations = transformations;
  }

  canApply() {
    return false;
  }

  refactor(code) {
    return this.transformations.reduce(
      (nextCode, transformation) => transformation(nextCode, babylon.parse(nextCode, babylonOptions)),
      code
    );
  }
}

module.exports = AbstractRefactoring;
