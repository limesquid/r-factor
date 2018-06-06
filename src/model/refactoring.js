const babylon = require('@babel/parser');
const { babylonOptions } = require('../options');

class Refactoring {
  constructor(transformations = []) {
    this.transformations = transformations;
  }

  canApply() {
    return false;
  }

  refactor(code) {
    return this.transformations.reduce(
      (nextCode, transformation) => {
        debugger;
        return transformation(
          nextCode,
          babylon.parse(nextCode, babylonOptions)
        );
      },
      code
    );
  }
}

module.exports = Refactoring;
