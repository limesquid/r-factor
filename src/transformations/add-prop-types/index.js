const traverse = require('@babel/traverse').default;
const {
  getClassComponentName,
  getFunctionalComponentName,
  isClassDeclaration,
  isArrowComponentDeclaration,
  isPropTypesDeclaration,
  isStaticPropTypesDeclaration
} = require('../../utils/ast');
const parser = require('../../utils/parser');
const { COMPONENT_TYPE } = require('../../constants');
const settings = require('../../settings');
const MovePropTypesToClass = require('../../refactorings/move-prop-types-to-class');
const CodeBuilder = require('./code-builder');

const addPropTypes = (code, ast, propTypes) => {
  const codeWithMultilinePropTypes = code
    .replace(
      /^(\s+)static\s+propTypes\s*=\s*{\s*}\s*(;?)/m,
      `$1static propTypes = {${settings.endOfLine}$1}$2`
    )
    .replace(
      /^([\t ]+)(\w+)\.propTypes\s*=\s*{\s*}\s*(;?)/m,
      `$1$2.propTypes = {${settings.endOfLine}$1}$3`
    );
  const newAst = codeWithMultilinePropTypes === code
    ? ast
    : parser.parse(codeWithMultilinePropTypes);
  const builder = new CodeBuilder(codeWithMultilinePropTypes, newAst);
  let isClass = false;
  let isStatic = false;

  builder.setNewPropTypes(propTypes);

  traverse(newAst, {
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

      if (isArrowComponentDeclaration(node)) {
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
