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
          console.log(error);
          console.log(`Code: "${nextCode}"`);
        }
      },
      code
    );
  }
}

module.exports = Refactoring;
