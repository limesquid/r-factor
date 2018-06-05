const traverse = require('@babel/traverse').default;
const {
  isClassDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const ComponentBuilder = require('./component-builder');
const FunctionalComponentBuilder = require('./functional-component-builder');

const addPropsUsage = (code, ast, props) => {
  let builder = null;

  traverse(ast, {
    enter({ node }) {
      if (isClassDeclaration(node)) {
        builder = new ComponentBuilder(code, ast);
        builder.setComponentNode(node);
      }

      if (isFunctionalComponentDeclaration(node)) {
        builder = new FunctionalComponentBuilder(code, ast);
        builder.setComponentNode(node);
      }
    }
  });

  if (!builder) {
    return code;
  }

  builder.setProps(props);

  return builder.build();
};

module.exports = addPropsUsage;
