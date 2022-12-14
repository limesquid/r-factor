const { isCallExpression, isIdentifier } = require('@babel/types');
const parser = require('../../utils/parser');
const { findBinding } = require('../../utils/bindings');
const removeImportDeclaration = require('../remove-import-declaration');
const ComponentExportDetails = require('../../utils/component-export-details');

const unwrapComponent = (source, ast = parser.parse(source), options) => {
  const { name: hocName, import: importDetails, removeInvoked = true } = options;
  const details = new ComponentExportDetails(ast).getDetails();
  const { componentScope, outermostHocPath } = details;
  const { hocPath, withInvoke } = getHocPath(outermostHocPath, hocName);

  if (!hocPath) {
    return source;
  }

  if (withInvoke && removeInvoked) {
    hocPath.node.callee.arguments
      .filter(isIdentifier)
      .map(({ name }) => findBinding(componentScope, name))
      .filter(Boolean)
      .forEach((binding) => {
        binding.path.remove();
      });
  }

  hocPath.replaceWith(hocPath.node.arguments[0]);
  const codeWithoutHoc = parser.print(ast);

  if (importDetails) {
    return removeImportDeclaration(codeWithoutHoc, ast, importDetails);
  }

  return codeWithoutHoc;
};

const getHocPath = (outermostHocPath, hocName) => {
  if (!outermostHocPath) {
    return {
      hocPath: null,
      withInvoke: false
    };
  }

  let hocIdentifierPath = null;
  if (outermostHocPath.node.callee.name === hocName) {
    hocIdentifierPath = outermostHocPath;
  } else {
    outermostHocPath.parentPath.traverse({
      CallExpression(path) {
        const { node } = path;
        if (isIdentifier(node.callee) && node.callee.name === hocName) {
          hocIdentifierPath = path;
          path.stop();
        }
      }
    });
  }

  if (!hocIdentifierPath) {
    return {
      hocPath: null,
      withInvoke: false
    };
  }

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
