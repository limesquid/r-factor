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
const { addImportDeclaration } = require('../../transformations');
const { getProps } = require('../../utils/props');
const { COMPONENT_TYPE } = require('../../constants');
const { Refactoring } = require('../../model');
const ClassBuilder = require('./class-builder');

class GeneratePropTypes extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.generatePropTypes,
      this.addPropTypesDeclaration
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
    let componentType = null;
    let componentName = null;
    const builder = new ClassBuilder(code);

    traverse(ast, {
      enter(path) {
        const { node } = path;

        if (isPropTypesDeclaration(node)) {
          builder.setPropTypesObjectNode(node.expression.right);
          builder.setPropTypesObjectNodePath(path.get('expression').get('right'));
        }

        if (isStaticPropTypesDeclaration(node)) {
          builder.setPropTypesObjectNode(node.value);
          builder.setPropTypesObjectNodePath(path.get('value'));
        }

        if (isClassDeclaration(node)) {
          builder.setComponentNode(node);
          componentName = getClassComponentName(node);
          componentType = COMPONENT_TYPE.Class;
        }

        if (isFunctionalComponentDeclaration(node)) {
          builder.setComponentNode(node);
          componentName = getFunctionalComponentName(node);
          componentType = COMPONENT_TYPE.Functional;
        }
      }
    });

    builder.setUsedProps(getProps(code, ast));
    builder.setComponentName(componentName);
    builder.setComponentType(componentType);

    return builder.build();
  }

  addPropTypesDeclaration(code, ast) {
    return addImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
  }
}

module.exports = GeneratePropTypes;
