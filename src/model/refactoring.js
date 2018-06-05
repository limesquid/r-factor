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
        try {
          return transformation(nextCode, babylon.parse(nextCode, babylonOptions));
        } catch (error) {
          return [
            `Error: "${error}"`,
            `Code: "${nextCode}"`
          ].join('\n');
        }
      },
      code
    );
  }
}

module.exports = Refactoring;
