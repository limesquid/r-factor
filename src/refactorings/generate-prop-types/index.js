const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const {
  isClassDeclaration,
  isArrowComponentDeclaration
} = require('../../utils/ast');
const { addPropTypes } = require('../../transformations');
const { getPropType, getUnusedProps } = require('../../utils/props');
const { Refactoring } = require('../../model');
const ConvertFunctionToArrowComponent = require('../convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class GeneratePropTypes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.generatePropTypes
    ];
  }

  canApply(code) {
    if (convertFunctionToArrowComponent.canApply(code)) {
      return true;
    }

    const ast = babylon.parse(code, babylonOptions);
    let isComponent = false;

    traverse(ast, {
      enter({ node }) {
        if (isClassDeclaration(node)) {
          isComponent = true;
        }

        if (isArrowComponentDeclaration(node)) {
          isComponent = true;
        }
      }
    });

    return isComponent;
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
    const unusedProps = getUnusedProps(code);
    const newPropTypes = unusedProps.reduce((propTypes, prop) => ({
      ...propTypes,
      [prop]: getPropType(prop)
    }), {});

    return addPropTypes(code, ast, newPropTypes);
  }
}

module.exports = GeneratePropTypes;
