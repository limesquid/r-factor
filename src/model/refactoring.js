const defaultParser = require('../utils/parser');

const CODE_SEPARATOR = '\n================================\n';

class Refactoring {
  constructor(parser = defaultParser, transformations = []) {
    this.parser = parser;
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
      this.parser.parse(code);
    } catch (error) {
      return [
        'Parsing failure - syntax error'
      ].join('\n');
    }

    const transformations = this.getTransformations(code);
    let nextCode = code;

    for (const transformation of transformations) {
      try {
        const ast = this.parser.parse(nextCode);
        nextCode = transformation(nextCode, ast);
      } catch (error) {
        return [
          'Exception occured while performing a transformation.',
          process.env.NODE_ENV !== 'production' && error.stack,
          process.env.NODE_ENV !== 'production' && `Code:${CODE_SEPARATOR}${nextCode}${CODE_SEPARATOR}`
        ].filter(Boolean).join('\n\n');
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
