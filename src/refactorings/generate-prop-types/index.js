const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const {
  getClassComponentName,
  getFunctionalComponentName,
  isClassDeclaration,
  isFunctionalComponentDeclaration,
  isPropTypesDeclaration,
  isStaticPropTypesDeclaration
} = require('../../utils/ast');
const { addProps } = require('../../transformations');
const { getProps } = require('../../utils/props');
const { COMPONENT_TYPE } = require('../../constants');
const { Refactoring } = require('../../model');

class GeneratePropTypes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.generatePropTypes
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let isComponent = false;

    traverse(ast, {
      enter({ node }) {
        if (isClassDeclaration(node)) {
          isComponent = true;
        }

        if (isFunctionalComponentDeclaration(node)) {
          isComponent = true;
        }
      }
    });

    return isComponent;
  }

  generatePropTypes(code, ast) {
    const props = getProps(code, ast);
    const newPropTypes = props.reduce((propTypes, prop) => ({
      ...propTypes,
      [prop]: 'PropTypes.any'
    }), {});
    return addProps(code, ast, newPropTypes);
  }
}

module.exports = GeneratePropTypes;
