const parser = require('../../utils/parser');
const ComponentExportDetails = require('../../utils/component-export-details');
const { addPropTypes, nameComponentIfUnnamed } = require('../../transformations');
const { Refactoring } = require('../../model');
const ConvertFunctionToArrowComponent = require('../convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class GeneratePropTypes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => nameComponentIfUnnamed(code, ast),
      this.generatePropTypes
    ];
  }

  canApply(code) {
    if (convertFunctionToArrowComponent.canApply(code)) {
      return true;
    }
    const ast = parser.parse(code);
    const details = new ComponentExportDetails(ast).getDetails();
    return details.isComponent;
  }

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

  generatePropTypes(code, ast) {
    return addPropTypes(code, ast);
  }
}

module.exports = GeneratePropTypes;
