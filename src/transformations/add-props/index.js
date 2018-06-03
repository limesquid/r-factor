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
const { COMPONENT_TYPE } = require('../../constants');
const CodeBuilder = require('./code-builder');

const addProps = (code, ast, propTypes = {}) => {
  const builder = new CodeBuilder(code);
  let componentType = null;
  let componentName = null;

  traverse(ast, {
    enter({ node }) {
      if (isPropTypesDeclaration(node)) {
        builder.setPropTypesObjectNode(node.expression.right);
      }

      if (isStaticPropTypesDeclaration(node)) {
        builder.setPropTypesObjectNode(node.value);
      }

      if (isClassDeclaration(node)) {
        builder.setNode(node);
        componentName = getClassComponentName(node);
        componentType = COMPONENT_TYPE.Class;
      }

      if (isFunctionalComponentDeclaration(node)) {
        builder.setNode(node);
        componentName = getFunctionalComponentName(node);
        componentType = COMPONENT_TYPE.Functional;
      }
    }
  });

  builder.setNewPropTypes(propTypes);
  builder.setComponentName(componentName);
  builder.setComponentType(componentType);

  return builder.build();
};

module.exports = addProps;
