const { isCallExpression, isIdentifier } = require('@babel/types');
const parser = require('../../utils/parser');
const removeImportDeclaration = require('../remove-import-declaration');
const ComponentExportDetails = require('../../utils/component-export-details');

const unwrapComponent = (source, ast = parser.parse(source), options) => {
  const { module, name: hocName, importDetails, removeInvoked = true } = options;
  const details = new ComponentExportDetails(ast).getDetails();
  const {
    // componentScope,
    outermostHocPath,
    // componentExportPath,
    // componentReturnPath,
  } = details;

  const { hocPath, withInvoke } = getHocPath(outermostHocPath, hocName);

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
      if (isIdentifier(node.callee) && node.calee.name === hocName) {
        hocIdentifierPath = path;
        path.stop();
      }
    }
  });

  const withInvoke = isCallExpression(hocIdentifierPath.parentPath.parentPath.callee);
  const hocPath = withInvoke
    ? hocIdentifierPath.parentPath
    : hocIdentifierPath;

  return {
    hocPath,
    withInvoke
  };
};

module.exports = unwrapComponent;
