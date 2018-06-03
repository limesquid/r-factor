const traverse = require('@babel/traverse').default;
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

const addProps = (code, ast, propTypes) => {
  const builder = new CodeBuilder(code, ast);

  builder.setNewPropTypes(propTypes);

  traverse(ast, {
    enter({ node }) {
      if (isPropTypesDeclaration(node)) {
        builder.setPropTypesObjectNode(node.expression.right);
      }

      if (isStaticPropTypesDeclaration(node)) {
        builder.setPropTypesObjectNode(node.value);
      }

      if (isClassDeclaration(node)) {
        builder.setComponentName(getClassComponentName(node));
        builder.setComponentNode(node);
        builder.setComponentType(COMPONENT_TYPE.Class);
      }

      if (isFunctionalComponentDeclaration(node)) {
        builder.setComponentName(getFunctionalComponentName(node));
        builder.setComponentNode(node);
        builder.setComponentType(COMPONENT_TYPE.Functional);
      }
    }
  });

  return builder.build();
};

module.exports = addProps;
