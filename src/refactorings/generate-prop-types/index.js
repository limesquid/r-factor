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

        if (isArrowComponentDeclaration(node)) {
          isComponent = true;
        }
      }
    });

    return isComponent;
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
