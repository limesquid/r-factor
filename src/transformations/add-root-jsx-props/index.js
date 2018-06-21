const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const CodeBuilder = require('./code-builder');

const addRootJsxProps = (code, ast, props) => Object.keys(props).reduce(
  (refactoredCode, key) => {
    const nextAst = code === refactoredCode ? ast : parser.parse(refactoredCode);
    const builder = new CodeBuilder(refactoredCode, nextAst);
    let jsxNode = null;

    builder.setProp(key, props[key]);

    traverse(nextAst, {
      JSXElement({ node }) {
        if (!jsxNode) {
          jsxNode = node;
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  },
  code
);

module.exports = addRootJsxProps;
