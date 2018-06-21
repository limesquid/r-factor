const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const {
  isClassDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const { addPropTypes } = require('../../transformations');
const { getUnusedProps } = require('../../utils/props');
const { Refactoring } = require('../../model');

class GeneratePropTypes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.generatePropTypes
    ];
  }

  canApply(code) {
    const ast = parser.parse(code);
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
    const unusedProps = getUnusedProps(code);
    const newPropTypes = unusedProps.reduce((propTypes, prop) => ({
      ...propTypes,
      [prop]: 'PropTypes.any'
    }), {});

    return addPropTypes(code, ast, newPropTypes);
  }
}

module.exports = GeneratePropTypes;
