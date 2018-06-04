const traverse = require('@babel/traverse').default;
const {
  isClassDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const { COMPONENT_TYPE } = require('../../constants');
const CodeBuilder = require('./code-builder');

const addPropsUsage = (code, ast, props) => {
  const builder = new CodeBuilder(code, ast);

  builder.setProps(props);

  traverse(ast, {
    enter({ node }) {
      if (isClassDeclaration(node)) {
        builder.setComponentNode(node);
        builder.setComponentType(COMPONENT_TYPE.Class);
      }

      if (isFunctionalComponentDeclaration(node)) {
        builder.setComponentNode(node);
        builder.setComponentType(COMPONENT_TYPE.Functional);
      }
    }
  });

  return builder.build();
};

module.exports = addPropsUsage;
