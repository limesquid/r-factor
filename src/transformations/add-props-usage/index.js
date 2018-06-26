const traverse = require('@babel/traverse').default;
const {
  isClassDeclaration,
  isArrowComponentDeclaration
} = require('../../utils/ast');
const ComponentBuilder = require('./component-builder');
const FunctionalComponentBuilder = require('./functional-component-builder');

const addPropsUsage = (code, ast, props) => {
  let builder = null;

  traverse(ast, {
    enter({ node }) {
      if (isClassDeclaration(node)) {
        builder = new ComponentBuilder(code, ast);
        builder.setNode(node);
      }

      if (isArrowComponentDeclaration(node)) {
        builder = new FunctionalComponentBuilder(code, ast);
        builder.setNode(node);
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
