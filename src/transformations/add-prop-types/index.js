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
const settings = require('../../settings');
const MovePropTypesToClass = require('../../refactorings/move-prop-types-to-class');
const CodeBuilder = require('./code-builder');

const addPropTypes = (code, ast, propTypes) => {
  const builder = new CodeBuilder(
    code.replace(
      /^(\s+)static\s+propTypes\s*=\s*{\s*}\s*(;?)/m,
      `$1static propTypes = {${settings.endOfLine}$1}$2`
    ),
    ast
  );
  let isClass = false;
  let isStatic = false;

  builder.setNewPropTypes(propTypes);

  traverse(ast, {
    enter({ node }) {
      if (isPropTypesDeclaration(node)) {
        builder.setPropTypesNode(node);
        builder.setPropTypesObjectNode(node.expression.right);
      }

      if (isStaticPropTypesDeclaration(node)) {
        isStatic = true;
        builder.setPropTypesNode(node);
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

  if (isClass && !isStatic) {
    const movePropTypesToClass = new MovePropTypesToClass();
    return movePropTypesToClass.refactor(builder.build());
  }

  return builder.build();
};

module.exports = addPropTypes;
