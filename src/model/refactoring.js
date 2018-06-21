const parser = require('../utils/parser');

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
            parser.parse(nextCode)
          );
        } catch (error) {
          return [
            'Exception occured while performing a transformation',
            `Error: ${error}`,
            `Code: ${nextCode}`
          ].join('\n');
        }
      },
      code
    );
  }
}

module.exports = Refactoring;
