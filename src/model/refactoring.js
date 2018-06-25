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
        let ast = null;

        try {
          ast = babylon.parse(nextCode, babylonOptions);
        } catch (error) {
          return [
            'Parsing failure - syntax error'
          ].join('\n');
        }

        try {
          return transformation(nextCode, ast);
        } catch (error) {
          return [
            'Exception occured while performing a transformation.',
            `${error}`,
            `Code: ${nextCode}`
          ].join('\n');
        }
      },
      code
    );
  }
}

module.exports = Refactoring;
