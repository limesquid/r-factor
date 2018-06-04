const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const CodeBuilder = require('./code-builder');

const addRootJsxProps = (code, ast, props) => Object.keys(props).reduce(
  (refactoredCode, key) => {
    const nextAst = code === refactoredCode ? ast : babylon.parse(refactoredCode, babylonOptions);
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
