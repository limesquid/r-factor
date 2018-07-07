const { isCallExpression, isIdentifier } = require('@babel/types');
const parser = require('../../utils/parser');
const removeImportDeclaration = require('../remove-import-declaration');
const ComponentExportDetails = require('../../utils/component-export-details');

const unwrapComponent = (source, ast = parser.parse(source), options) => {
  const { name: hocName, importDetails, removeInvoked = true } = options;
  const details = new ComponentExportDetails(ast).getDetails();
  const {
    componentScope,
    outermostHocPath,
    // componentExportPath,
    // componentReturnPath,
  } = details;

  const { hocPath, withInvoke } = getHocPath(outermostHocPath, hocName);

  if (withInvoke && removeInvoked) {
    const invokeArguments = hocPath.node.callee.arguments
      .filter(isIdentifier)
      .map(({ name }) => name);
    invokeArguments.forEach((argument) => componentScope.remove(argument));
  }

  hocPath.replaceWith(hocPath.node.arguments[0]);

  const codeWithoutHoc = parser.print(ast);

  if (importDetails) {
    return removeImportDeclaration(codeWithoutHoc, ast, importDetails);
  }

  return codeWithoutHoc;
};

const getHocPath = (outermostHocPath, hocName) => {
  let hocIdentifierPath = outermostHocPath;
  outermostHocPath.traverse({
    CallExpression(path) {
      const { node } = path;
      if (isIdentifier(node.callee) && node.callee.name === hocName) {
        hocIdentifierPath = path;
        path.stop();
      }
    }
  });

  const isParentCallExpression = isCallExpression(hocIdentifierPath.parent);
  const withInvoke = isParentCallExpression && !hocIdentifierPath.parent.arguments.includes(
    hocIdentifierPath.node
  );
  const hocPath = withInvoke
    ? hocIdentifierPath.parentPath
    : hocIdentifierPath;

  return {
    hocPath,
    withInvoke
  };
};

module.exports = unwrapComponent;
