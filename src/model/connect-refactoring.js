const Refactoring = require('./refactoring');
const ConvertFunctionToArrowComponent = require('../refactorings/convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../refactorings/convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class ConnectRefactoring extends Refactoring {
  getTransformations(initialCode) {
    if (convertFunctionToArrowComponent.canApply(initialCode)) {
      return [
        (code, ast) => convertFunctionToArrowComponent.refactor(code, ast),
        ...this.transformations,
        (code, ast) => convertToFunctionComponent.refactor(code, ast)
      ];
    }
    return this.transformations;
  }
}

module.exports = ConnectRefactoring;
