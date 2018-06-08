const { Refactoring } = require('../../model');
const sortImports = require('../../transformations/sort-imports');

class SortImports extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => sortImports(code, ast)
    ];
  }

  canApply() {
    return true;
  }
}

module.exports = SortImports;
