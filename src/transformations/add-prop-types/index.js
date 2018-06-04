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
const MovePropTypesToClass = require('../../refactorings/move-prop-types-to-class');
const CodeBuilder = require('./code-builder');

const addPropTypes = (code, ast, propTypes) => {
  const builder = new CodeBuilder(code, ast);
  let isClass = false;

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
        isClass = true;
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

  if (isClass) {
    const movePropTypesToClass = new MovePropTypesToClass();
    return movePropTypesToClass.refactor(builder.build());
  }

  return builder.build();
};

module.exports = addPropTypes;
