const traverse = require('@babel/traverse').default;
const parser = require('../../utils/parser');
const CodeBuilder = require('./code-builder');

const addRootJsxProps = (code, ast, props) => Object.keys(props).reduce(
  (refactoredCode, key) => {
    const nextAst = parser.parse(refactoredCode);
    const builder = new CodeBuilder(refactoredCode, nextAst);

    builder.setProp(key, props[key]);

    traverse(nextAst, {
      JSXElement(path) {
        builder.setNode(path.node);
        path.stop();
      }
    });

    return builder.build();
  },
  code
);

module.exports = addRootJsxProps;
