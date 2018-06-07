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
          return transformation(
            nextCode,
            babylon.parse(nextCode, babylonOptions)
          );
        } catch (error) {
          console.log([
            'Exception occured while performing a transformation',
            `Error: ${error}`,
            `Code: ${nextCode}`
          ].join('\n'));
          throw error;
        }
      },
      code
    );
  }
}

module.exports = Refactoring;
